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

/**
 * Handles CRUD operations for records in the "Database" table
 * @author Matthew Derbyshire
 *
 */
@Service
public class DatabaseService {
	
	/**
	 * The repository for the "Database" table
	 */
	DatabaseRepository databaseRepo;
	
	/**
	 * The repository for the "Schema" table
	 */
	SchemaRepository schemaRepo;
	
	/**
	 * The repository for the "Table" table
	 */
	TableRepository tableRepo;
	
	/**
	 * The repository for the "Column" table
	 */
	ColumnRepository columnRepo;
	
	/**
	 * The factory for generating the right HTTP-status exception for any exception thrown
	 */
	HttpStatusExceptionFactory httpStatusExceptionFactory;
	
	/**
	 * Finds tables/columns in a given list of schema entities
	 */
	DatabaseEntityIdentifier databaseEntityIdentifier;
	
	/**
	 * Constructor
	 * @param exFactory The factory for generating the right HTTP-status exception for any exception thrown
	 * @param databaseEntityIdentifier Finds tables/columns in a given list of schema entities
	 * @param databaseRepo The repository for the "Database" table
	 * @param schemaRepo The repository for the "Schema" table
	 * @param tableRepo The repository for the "Table" table
	 * @param columnRepo The repository for the "Column" table
	 */
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
	
	
	/**
	 * Gets all of the "database" records in the database, but only returns them as projections 
	 * with just the name and ID
	 * @return A list of DatabaseNameIdProjection objects
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
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
	
	
	/**
	 * Gets the "database" record with the given ID
	 * @param id The PK of the "database" record
	 * @return The Database object for this "database" entity
	 * @throws RecordNotFoundException Thrown if the requested record is not found
	 * @throws UnprocessableEntityException Thrown if there is something wrong with an entity
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
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
	
	/**
	 * Adds a new "database" record (and all of its inner child records) to the database. This runs 
	 * the creation process within a transaction
	 * @param newDatabase The new database record to be added
	 * @return The new "database" record that had been created
	 * @throws UnprocessableEntityException Thrown if there is something wrong with an entity
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
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
	
	
	/**
	 * Updates the name of the "database" record with the given ID
	 * @param newDatabase An instance of Database, with the new name
	 * @param id The ID of the database record to be updated
	 * @return The newly updated "database" record
	 * @throws RecordNotFoundException Thrown if the requested record is not found
	 * @throws UnprocessableEntityException Thrown if there is something wrong with an entity
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
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
	
	
	/**
	 *  Deletes the "database" record with the given ID
	 * @param id The ID of the "database" record to delete
	 * @throws BadRequestException Thrown if the requested record is not found
	 * @throws InternalServerErrorException Thrown if there is a general error
	 * @throws RecordNotFoundException Thrown if there is something wrong with an entity
	 */
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
