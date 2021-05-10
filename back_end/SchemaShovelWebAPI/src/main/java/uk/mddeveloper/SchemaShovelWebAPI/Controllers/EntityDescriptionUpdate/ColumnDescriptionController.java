package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;

@RestController
@RequestMapping("/api/v1/columns")
public class ColumnDescriptionController extends DescriptionUpdateSuperController<Column> {
	
	@Autowired
	ColumnRepository repo;
	
	@PatchMapping("/update_description/{id}")
	DescriptionOnlyHelperModel updateDescription(@RequestBody DescriptionOnlyHelperModel newDescription, @PathVariable Long id) 
			throws RecordNotFoundException, RuntimeException, Throwable
	{	
		return updateDescriptionUsingProvidedRepo(newDescription, id, repo);
	}
	
}