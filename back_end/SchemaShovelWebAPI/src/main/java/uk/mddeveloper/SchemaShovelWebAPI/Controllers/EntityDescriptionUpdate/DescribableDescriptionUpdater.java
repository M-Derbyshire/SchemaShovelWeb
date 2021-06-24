package uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.jpa.repository.JpaRepository;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Exceptions.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.IDescribable;

public class DescribableDescriptionUpdater<T extends IDescribable> {


	//Initially the repo was being set on the class, but as it's autowired in the
	//controllers, this became more complicated then it needed to be (even in their
	//constructors, the repo was still null). So just passinf here.
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
