package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Component;

@Component
public class HttpStatusExceptionFactory {
	
	public RuntimeException createHttpStatusException(Exception e)
	{
		if(e instanceof RecordNotFoundException)
		{
			//While the first instinct may be to just return the passed exception,
			//the caller is expecting a new object
			return new RecordNotFoundException(e.getMessage(), e);
		}
		else if(e instanceof InvalidDataAccessApiUsageException)
		{
			return new UnprocessableEntityException(e.getMessage(), e);
		}
		
		return new InternalServerErrorException(e.getMessage(), e);
	}
	
}