package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.SchemaRepository;

@RestController
@RequestMapping("/api/v1/schemas")
public class SchemaDescriptionController {
	
	@Autowired
	SchemaRepository repo;
	
	@Autowired
	DescribableDescriptionUpdater<Schema> descriptionUpdater;

	
	@PatchMapping("/update_description/{id}")
	DescriptionOnlyHelperModel updateDescription(@RequestBody DescriptionOnlyHelperModel newDescription, @PathVariable Long id) 
			throws RecordNotFoundException, RuntimeException, Throwable
	{	
		return descriptionUpdater.updateDescriptionWithGivenRepo(newDescription, id, repo);
	}
	
}
