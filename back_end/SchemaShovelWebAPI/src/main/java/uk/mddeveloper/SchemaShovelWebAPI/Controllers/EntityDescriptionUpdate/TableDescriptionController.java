package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.TableRepository;

@RestController
@RequestMapping("/api/v1/tables")
public class TableDescriptionController {
	
	TableRepository repo;
	DescribableDescriptionUpdater<Table> descriptionUpdater;
	
	public TableDescriptionController(TableRepository repo, 
			DescribableDescriptionUpdater<Table> descriptionUpdater)
	{
		this.repo = repo;
		this.descriptionUpdater = descriptionUpdater;
	}
	
	
	@PatchMapping("/update_description/{id}")
	DescriptionOnlyHelperModel updateDescription(@RequestBody DescriptionOnlyHelperModel newDescription, @PathVariable Long id) 
			throws RecordNotFoundException, RuntimeException, Throwable
	{	
		return descriptionUpdater.updateDescriptionWithGivenRepo(newDescription, id, repo);
	}
	
}
