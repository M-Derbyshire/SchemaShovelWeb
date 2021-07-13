package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.HttpStatusExceptionFactory;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.IDescribable;

@Component
public class DescribableDescriptionUpdater<T extends IDescribable> {
	
	HttpStatusExceptionFactory httpStatusExceptionFactory;
	
	public DescribableDescriptionUpdater(HttpStatusExceptionFactory exFactory)
	{
		this.httpStatusExceptionFactory = exFactory;
	}
	
	
	DescriptionOnlyHelperModel updateDescriptionWithGivenRepo(
			DescriptionOnlyHelperModel newDescription, 
			Long id,
			JpaRepository<T, Long> repo
			) 
			throws UnprocessableEntityException, InternalServerErrorException
	{	
		try
		{
			IDescribable entity = (IDescribable) repo.findById(id).orElseThrow(() -> new RecordNotFoundException());
			
			String newDescString = newDescription.getDescription();
			if(newDescString == null) 
				throw new UnprocessableEntityException("The provided JSON did not contain a valid description property.");
			
			entity.setDescription(newDescString);
			
			entity = repo.save((T) entity);
			
			newDescription.setId(id);
			return newDescription;
		}
		catch(RuntimeException e)
		{
			throw httpStatusExceptionFactory.createHttpStatusException(e);
		}
	}
	
}
