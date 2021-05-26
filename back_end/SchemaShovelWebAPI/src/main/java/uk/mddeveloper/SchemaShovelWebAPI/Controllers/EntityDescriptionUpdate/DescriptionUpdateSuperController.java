package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RestController;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.IDescribable;

@RestController
public class DescriptionUpdateSuperController<T extends IDescribable> {
	
	/*
		This is a super class that provides functionality to update ONLY the description of
		an entity (which is all we want to allow updates on for most of our entities).
		
		NOTE: this.repo needs to be autowired on the subclass. You also need to setup the path
		method yourself, and pass it's arguments -- and the repo -- into the 
		updateDescriptionUsingProvidedRepo() method below.
		
		E.g:
		------------------------------
		@Autowired
		SchemaRepository repo;
		
		@PatchMapping("/update_description/{id}")
		DescriptionOnlyHelperModel updateDescription(@RequestBody DescriptionOnlyHelperModel newDescription, 
				@PathVariable Long id) throws RecordNotFoundException, RuntimeException, Throwable
		{	
			return updateDescriptionUsingProvidedRepo(newDescription, id, repo);
		}
		------------------------------
		
		This was the best solution, after a few hour struggling to autowire a generic repo 
		type (even with a qualifier)
		
	*/
	
	
	//When passed JSON that only contains the description
	DescriptionOnlyHelperModel updateDescriptionUsingProvidedRepo(
			DescriptionOnlyHelperModel newDescription, 
			Long id, 
			JpaRepository<T, Long> repo
			) 
			throws UnprocessableEntityException, InternalServerErrorException
	{	
		try
		{
			IDescribable entity = (IDescribable) repo.findById(id).orElseThrow(() -> new RecordNotFoundException());
			
			entity.setDescription(newDescription.getDescription());
			
			entity = repo.save((T) entity);
			
			newDescription.setId(id);
			return newDescription;
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
