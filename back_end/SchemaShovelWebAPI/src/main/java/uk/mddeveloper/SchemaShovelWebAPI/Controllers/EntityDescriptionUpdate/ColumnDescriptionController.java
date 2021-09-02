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

@RestController
@RequestMapping("/api/v1/columns")
public class ColumnDescriptionController extends Controller {
	
	ColumnRepository repo;
	DescribableDescriptionUpdater<Column> descriptionUpdater;
	
	public ColumnDescriptionController(ColumnRepository repo, 
			DescribableDescriptionUpdater<Column> descriptionUpdater)
	{
		this.repo = repo;
		this.descriptionUpdater = descriptionUpdater;
	}
	
	
	@PatchMapping("/update_description/{id}")
	public DescriptionOnlyHelperModel updateDescription(@Valid @RequestBody DescriptionOnlyHelperModel newDescription, @PathVariable Long id) 
			throws MethodArgumentNotValidException, RecordNotFoundException, RuntimeException, Throwable
	{	
		return descriptionUpdater.updateDescriptionWithGivenRepo(newDescription, id, repo);
	}
	
}