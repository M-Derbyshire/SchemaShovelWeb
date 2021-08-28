package uk.mddeveloper.SchemaShovelWebAPI.Controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.BadRequestException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections.DatabaseNameIdProjection;
import uk.mddeveloper.SchemaShovelWebAPI.Services.DatabaseService;

@RestController
@RequestMapping("/api/v1/databases")
public class DatabaseController {
	
	DatabaseService databaseService;
	
	public DatabaseController(DatabaseService databaseService)
	{
		this.databaseService = databaseService;
	}
	
	//Retrieval methods
	
	@GetMapping("")
	public List<DatabaseNameIdProjection> getAll() throws InternalServerErrorException
	{
		return databaseService.getAll();
	}
	
	
	@GetMapping("/{id}")
	public Database getOne(@PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.getOne(id);
	}
	
	
	
	@PostMapping("")
	public Database create(@RequestBody Database newDatabase) 
			throws UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.create(newDatabase);
	}
	
	
	@PatchMapping("/{id}")
	public Database update(@RequestBody Database newDatabase, @PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.update(newDatabase, id);
	}
	
	
	
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) 
			throws BadRequestException, InternalServerErrorException, RecordNotFoundException
	{
		databaseService.delete(id);
	}
}
