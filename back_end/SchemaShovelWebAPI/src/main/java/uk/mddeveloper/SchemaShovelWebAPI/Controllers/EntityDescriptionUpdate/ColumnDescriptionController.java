package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import javax.validation.Valid;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater.DescribableDescriptionUpdater;
import uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater.DescriptionOnlyHelperModel;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Controller;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;

/**
 * A controller for updating description fields on "column" entities (route "/api/v1/columns")
 * @author Matthew Derbyshire
 *
 */
@RestController
@RequestMapping("/api/v1/columns")
public class ColumnDescriptionController extends Controller {
	
	/**
	 * The repository for this particular entity type
	 */
	ColumnRepository repo;
	
	/**
	 * The class that handles the updating of entity descriptions
	 */
	DescribableDescriptionUpdater<Column> descriptionUpdater;
	
	/**
	 * Constructor
	 * @param repo The repository for this particular entity type
	 * @param descriptionUpdater The class that handles the updating of entity descriptions
	 */
	public ColumnDescriptionController(ColumnRepository repo, 
			DescribableDescriptionUpdater<Column> descriptionUpdater)
	{
		this.repo = repo;
		this.descriptionUpdater = descriptionUpdater;
	}
	
	
	/**
	 * Updates the entity description with the new description in the given DescriptionOnlyHelperModel 
	 * instance
	 * @param newDescription A DescriptionOnlyHelperModel instance with the new description
	 * @param id The ID of the entity to be updated
	 * @return A DescriptionOnlyHelperModel instance, with the newly updated description
	 * @throws MethodArgumentNotValidException Thrown if there is a model validation issue
	 * @throws RecordNotFoundException Thrown if the requested record is not found
	 * @throws RuntimeException General error
	 * @throws Throwable General error
	 */
	@PatchMapping("/update_description/{id}")
	public DescriptionOnlyHelperModel updateDescription(@Valid @RequestBody DescriptionOnlyHelperModel newDescription, @PathVariable Long id) 
			throws MethodArgumentNotValidException, RecordNotFoundException, RuntimeException, Throwable
	{	
		return descriptionUpdater.updateDescriptionWithGivenRepo(newDescription, id, repo);
	}
	
}