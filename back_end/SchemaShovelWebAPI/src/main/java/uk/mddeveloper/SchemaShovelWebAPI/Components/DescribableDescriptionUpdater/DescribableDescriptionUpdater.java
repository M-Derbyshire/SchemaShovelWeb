package uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.HttpStatusExceptionFactory;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.IDescribable;

/**
 * This is used to update the descriptions of any models that implement IDescribable
 * 
 * @author Matthew Derbyshire
 *
 * @param <T> The type for the instance (must implement IDescribable)
 */
@Component
public class DescribableDescriptionUpdater<T extends IDescribable> {
	
	/**
	 * The factory for generating the right HTTP-status exception for any exception thrown
	 */
	HttpStatusExceptionFactory httpStatusExceptionFactory;
	
	/**
	 * Constructor
	 * @param exFactory The factory for generating the right HTTP-status exception for any exception thrown
	 */
	public DescribableDescriptionUpdater(HttpStatusExceptionFactory exFactory)
	{
		this.httpStatusExceptionFactory = exFactory;
	}
	
	/**
	 * Using the given repository, update the description of an object that implements IDescribable
	 * @param newDescription A DescriptionOnlyHelperModel instance, with the new description for the entity
	 * @param id The PK of the entity
	 * @param repo The repository to use to perform this operation
	 * @return A DescriptionOnlyHelperModel instance, with the new description
	 * @throws UnprocessableEntityException Thrown if the provided description is null
	 * @throws InternalServerErrorException Thrown if there is any general error
	 */
	public DescriptionOnlyHelperModel updateDescriptionWithGivenRepo(
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
