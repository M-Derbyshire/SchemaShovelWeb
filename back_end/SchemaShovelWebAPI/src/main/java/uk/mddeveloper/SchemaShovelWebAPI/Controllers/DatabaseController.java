package uk.mddeveloper.SchemaShovelWebAPI.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

@RestController
@RequestMapping("/api/v1/databases")
public class DatabaseController {
	
	@Autowired
	DatabaseRepository databaseRepo;	
	
	@Autowired
	SchemaRepository schemaRepo;
	
	@Autowired
	TableRepository tableRepo;
	
	@Autowired
	ColumnRepository columnRepo;
	
	//Retrieval methods
	
	@GetMapping("/")
	List<DatabaseNameIdProjection> getAll() throws InternalServerErrorException
	{
		List<DatabaseNameIdProjection> results;
		
		try
		{
			results = databaseRepo.findAllIdAndName();
		}
		catch(RuntimeException e)
		{
			throw new InternalServerErrorException();
		}
		
		return results;
	}
	
	
	@GetMapping("/{id}")
	Database getOne(@PathVariable Long id) 
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
	
	
	
	//Create/update methods
	
	@PostMapping("/")
	Database create(@RequestBody Database newDatabase) 
			throws UnprocessableEntityException, InternalServerErrorException
	{
		
		try
		{
			newDatabase = databaseRepo.save(newDatabase);
			
			
			//Save the inner objects (there are multiple levels to this)
			for(Schema schema : newDatabase.getSchemas())
			{
				schema.setDatabase(newDatabase);
				schema = schemaRepo.save(schema);
				
				for(Table table : schema.getTables())
				{
					table.setSchema(schema);
					table = tableRepo.save(table);
					
					for(Column column : table.getColumns())
					{
						column.setTable(table);
						columnRepo.save(column);
					}
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
	
	
	@PutMapping("/{id}")
	Database update(@RequestBody Database newDatabase, @PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		Database database = null;
		
		try
		{
			database = databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
			database.setName(newDatabase.getName());
			
			database = databaseRepo.save(database);
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
	
	
	
	//Delete method
	
	@DeleteMapping("/{id}")
	void delete(@PathVariable Long id) 
			throws BadRequestException, InternalServerErrorException, RecordNotFoundException
	{
		try
		{
			//The cascading policy for the related entities is handled by the DB
			if(databaseRepo.existsById(id))
			{
				databaseRepo.deleteById(id);
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
