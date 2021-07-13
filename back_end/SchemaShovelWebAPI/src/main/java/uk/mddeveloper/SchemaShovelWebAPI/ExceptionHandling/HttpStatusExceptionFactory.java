package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Component;

@Component
public class HttpStatusExceptionFactory {
	
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