package uk.mddeveloper.SchemaShovelWebAPI.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.BadRequestException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.DatabaseRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.SchemaRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.TableRepository;

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
	List<Database> getAll()
	{
		return databaseRepo.findAll();
	}
	
	@GetMapping("/{id}")
	Database getOne(@PathVariable Long id) throws RecordNotFoundException
	{
		return databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
	}
	
	
	
	//Create/update methods
	
	@PostMapping("/")
	Database create(@RequestBody Database newDatabase) throws BadRequestException
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
		catch(Exception e)
		{
			throw new BadRequestException();
		}
	}
	
	@PutMapping("/{id}")
	Database update(@RequestBody Database newDatabase, @PathVariable Long id) throws RuntimeException
	{
		Database database = databaseRepo.findById(id).orElseThrow(() -> new RecordNotFoundException());
		
		database.setName(newDatabase.getName());
		
		try
		{
			database = databaseRepo.save(database);
		}
		catch(Exception e)
		{
			throw new BadRequestException();
		}
		
		return database;
	}
	
	
	
	//Delete method
	
	@DeleteMapping("/{id}")
	void delete(@PathVariable Long id) throws BadRequestException
	{
		try
		{
			databaseRepo.deleteById(id);
		}
		catch(Exception e)
		{
			throw new BadRequestException();
		}
	}
}
