package uk.mddeveloper.SchemaShovelWebAPI.Services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier.DatabaseEntityIdentifier;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.BadRequestException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.HttpStatusExceptionFactory;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.DatabaseRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.SchemaRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.TableRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections.DatabaseNameIdProjection;

@Service
public class DatabaseService {
	
	DatabaseRepository databaseRepo;
	SchemaRepository schemaRepo;
	TableRepository tableRepo;
	ColumnRepository columnRepo;
	
	HttpStatusExceptionFactory httpStatusExceptionFactory;
	DatabaseEntityIdentifier databaseEntityIdentifier;
	
	
	public DatabaseService(HttpStatusExceptionFactory exFactory, 
			DatabaseEntityIdentifier databaseEntityIdentifier, DatabaseRepository databaseRepo, 
			SchemaRepository schemaRepo, TableRepository tableRepo, ColumnRepository columnRepo)
	{
		this.databaseRepo = databaseRepo;
		this.schemaRepo = schemaRepo;
		this.tableRepo = tableRepo;
		this.columnRepo = columnRepo;
		
		this.httpStatusExceptionFactory = exFactory;
		this.databaseEntityIdentifier = databaseEntityIdentifier;
	}
	
	
	public List<DatabaseNameIdProjection> getAll() throws InternalServerErrorException
	{
		List<DatabaseNameIdProjection> results;
		
		try
		{
			results = databaseRepo.findAllIdAndName();
		}
		catch(RuntimeException e)
		{
			throw new InternalServerErrorException(e.getMessage(), e);
		}
		
		return results;
	}
	
	
	
	public Database getOne(Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		Database result = null;
		
		try
		{
			result = databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
		}
		catch(RuntimeException e)
		{
			throw httpStatusExceptionFactory.createHttpStatusException(e);
		}
		
		return result;
	}
	
	
	@Transactional
	public Database create(Database newDatabase) 
			throws UnprocessableEntityException, InternalServerErrorException
	{
		
		try
		{
			//****************************************************************
			//This goes over the schemas/tables multiple times,
			//but this allows us to save on calls to the database.
			
			//This repetition of loops has drastically cut down the time it 
			//takes to map a large database's JSON into the DB.
			
			//****************************************************************
			
			newDatabase = databaseRepo.saveAndFlush(newDatabase);
			
			
			for(Schema schema : newDatabase.getSchemas())
			{
				schema.setDatabase(newDatabase);
			}
			newDatabase.setSchemas(schemaRepo.saveAll(newDatabase.getSchemas()));
			
			
			for(Schema schema : newDatabase.getSchemas())
			{
				for(Table table : schema.getTables())
				{
					table.setSchema(schema);
				}
				schema.setTables(tableRepo.saveAll(schema.getTables()));
			}
			
			
			for(Schema schema : newDatabase.getSchemas())
			{
				for(Table table : schema.getTables())
				{
					for(Column column : table.getColumns())
					{
						column.setTable(table);
						
						if(column.getFkToTableStr() != null)
						{
							column.setFkToTable(databaseEntityIdentifier.getTableAtPath(
									newDatabase.getSchemas(), 
									column.getFkToTableStr()));
						}
					}
					columnRepo.saveAll(table.getColumns());
				}
			}
			
			return newDatabase;	
		}
		catch(RuntimeException e)
		{
			throw httpStatusExceptionFactory.createHttpStatusException(e);
		}
	}
	
	
	
	public Database update(Database newDatabase, Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		Database database = null;
		
		try
		{
			database = databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
			database.setName(newDatabase.getName());
			
			database = databaseRepo.saveAndFlush(database);
		}
		catch(RuntimeException e)
		{
			throw httpStatusExceptionFactory.createHttpStatusException(e);
		}
		
		return database;
	}
	
	
	
	public void delete(Long id) 
			throws BadRequestException, InternalServerErrorException, RecordNotFoundException
	{
		try
		{
			//The cascading policy for the related entities is handled by the DB
			if(databaseRepo.existsById(id))
			{
				databaseRepo.deleteRecordAndRelations(id);
			}
			else
			{
				throw new RecordNotFoundException("The database record does not exist.");
			}
		}
		catch(RuntimeException e)
		{
			throw httpStatusExceptionFactory.createHttpStatusException(e);
		}
	}
}
