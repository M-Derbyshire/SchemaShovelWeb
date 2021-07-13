package uk.mddeveloper.SchemaShovelWebAPI.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
import uk.mddeveloper.SchemaShovelWebAPI.Services.DatabaseService;

@RestController
@RequestMapping("/api/v1/databases")
public class DatabaseController {
	
	@Autowired
	DatabaseService databaseService;
	
	//Retrieval methods
	
	@GetMapping("")
	List<DatabaseNameIdProjection> getAll() throws InternalServerErrorException
	{
		return databaseService.getAll();
	}
	
	
	@GetMapping("/{id}")
	Database getOne(@PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.getOne(id);
	}
	
	
	
	@PostMapping("")
	Database create(@RequestBody Database newDatabase) 
			throws UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.create(newDatabase);
	}
	
	
	@PatchMapping("/{id}")
	Database update(@RequestBody Database newDatabase, @PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.update(newDatabase, id);
	}
	
	
	
	@DeleteMapping("/{id}")
	void delete(@PathVariable Long id) 
			throws BadRequestException, InternalServerErrorException, RecordNotFoundException
	{
		databaseService.delete(id);
	}
}
