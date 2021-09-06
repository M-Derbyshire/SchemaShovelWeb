package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Component;

/**
 * When given an exception, this factory will create a new exception that has an Http status code 
 * associated with it. If there is no specific http-exception class for the given exception, an 
 * InternalServerErrorException is returned
 * @author Matthew Derbyshire
 *
 */
@Component
public class HttpStatusExceptionFactory {
	
	/**
	 * Takes an exception, and returns a new exception that has a Http status code associated with it
	 * @param e The exception to find a correct status code for
	 * @return The new exception, that represents an Http status code
	 */
	public RuntimeException createHttpStatusException(Exception e)
	{
		//While the first instinct may be to just return the passed exception if it's the same,
		//the caller is expecting a new object
		if(e instanceof RecordNotFoundException)
		{
			return new RecordNotFoundException(e.getMessage(), e);
		}
		else if(e instanceof InvalidDataAccessApiUsageException 
				|| e instanceof UnprocessableEntityException)
		{
			return new UnprocessableEntityException(e.getMessage(), e);
		}
		
		return new InternalServerErrorException(e.getMessage(), e);
	}
	
}