package uk.mddeveloper.SchemaShovelWebAPI.Services;

import java.util.List;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.BadRequestException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.UnprocessableEntityException;
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
	
	
	public DatabaseService(DatabaseRepository databaseRepo, SchemaRepository schemaRepo, 
			TableRepository tableRepo, ColumnRepository columnRepo)
	{
		this.databaseRepo = databaseRepo;
		this.schemaRepo = schemaRepo;
		this.tableRepo = tableRepo;
		this.columnRepo = columnRepo;
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
	
	
	
	public Database getOne(@PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		Database result = null;
		
		try
		{
			result = databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
		}
		catch(RecordNotFoundException e)
		{
			throw e;
		}
		catch(InvalidDataAccessApiUsageException e)
		{
			throw new UnprocessableEntityException();
		}
		catch(RuntimeException e)
		{
			if(e instanceof UnprocessableEntityException || e instanceof RecordNotFoundException)
			{
				throw e;
			}
			
			throw new InternalServerErrorException();
		}
		
		return result;
	}
	
	
	@Transactional
	public Database create(@RequestBody Database newDatabase) 
			throws UnprocessableEntityException, InternalServerErrorException
	{
		
		try
		{
			//This goes over the schemas/tables multiple times,
			//but this allows us to save on calls to the database.
			
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
					}
					columnRepo.saveAll(table.getColumns());
				}
			}
			
			return newDatabase;	
		}
		catch(InvalidDataAccessApiUsageException e)
		{
			throw new UnprocessableEntityException();
		}
		catch(RuntimeException e)
		{
			if(e instanceof UnprocessableEntityException)
			{
				throw e;
			}
			throw new InternalServerErrorException();
		}
	}
	
	
	
	public Database update(@RequestBody Database newDatabase, @PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		Database database = null;
		
		try
		{
			database = databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
			database.setName(newDatabase.getName());
			
			database = databaseRepo.saveAndFlush(database);
		}
		catch(RecordNotFoundException e)
		{
			throw e;
		}
		catch(InvalidDataAccessApiUsageException e)
		{
			throw new UnprocessableEntityException();
		}
		catch(RuntimeException e)
		{
			if(e instanceof UnprocessableEntityException || e instanceof RecordNotFoundException)
			{
				throw e;
			}
			throw new InternalServerErrorException();
		}
		
		return database;
	}
	
	
	
	public void delete(@PathVariable Long id) 
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
				throw new RecordNotFoundException();
			}
		}
		catch(RecordNotFoundException e)
		{
			throw e;
		}
		catch(InvalidDataAccessApiUsageException e)
		{
			throw new UnprocessableEntityException();
		}
		catch(RuntimeException e)
		{
			if(e instanceof UnprocessableEntityException || e instanceof RecordNotFoundException)
			{
				throw e;
			}
			throw new InternalServerErrorException();
		}
	}
}
