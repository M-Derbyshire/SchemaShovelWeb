package uk.mddeveloper.SchemaShovelWebAPI.Controllers;

import java.util.List;

import javax.validation.Valid;

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

/**
 * The controller for all requests relating to "database" entities (route "/api/v1/databases")
 * @author Matthew Derbyshire
 *
 */
@RestController
@RequestMapping("/api/v1/databases")
public class DatabaseController extends Controller {
	
	/**
	 * The service that handles CRUD operations to "database" entities
	 */
	DatabaseService databaseService;
	
	/**
	 * Constructor.
	 * @param databaseService The service that handles CRUD operations to "database" entities
	 */
	public DatabaseController(DatabaseService databaseService)
	{
		this.databaseService = databaseService;
	}
	
	
	/**
	 * Gets all of the "database" records in the database, but only returns them as projections 
	 * with just the name and ID
	 * @return A list of DatabaseNameIdProjection objects
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
	@GetMapping("")
	public List<DatabaseNameIdProjection> getAll() throws InternalServerErrorException
	{
		return databaseService.getAll();
	}
	
	/**
	 * Gets the "database" record with the given ID
	 * @param id The PK of the "database" record
	 * @return The Database object for this "database" entity
	 * @throws RecordNotFoundException Thrown if the requested record is not found
	 * @throws UnprocessableEntityException Thrown if there is something wrong with an entity
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
	@GetMapping("/{id}")
	public Database getOne(@PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.getOne(id);
	}
	
	
	/**
	 * Adds a new "database" record (and all of its inner child records) to the database
	 * @param newDatabase The new database record to be added
	 * @return The new "database" record that had been created
	 * @throws UnprocessableEntityException Thrown if there is something wrong with an entity
	 * @throws InternalServerErrorException Thrown if there is a general error
	 */
	@PostMapping("")
	public Database create(@Valid @RequestBody Database newDatabase) 
			throws UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.create(newDatabase);
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
	@PatchMapping("/{id}")
	public Database update(@Valid @RequestBody Database newDatabase, @PathVariable Long id) 
			throws RecordNotFoundException, UnprocessableEntityException, InternalServerErrorException
	{
		return databaseService.update(newDatabase, id);
	}
	
	
	/**
	 * Deletes the "database" record with the given ID
	 * @param id The ID of the "database" record to delete
	 * @throws BadRequestException Thrown if the requested record is not found
	 * @throws InternalServerErrorException Thrown if there is a general error
	 * @throws RecordNotFoundException Thrown if there is something wrong with an entity
	 */
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id) 
			throws BadRequestException, InternalServerErrorException, RecordNotFoundException
	{
		databaseService.delete(id);
	}
}
