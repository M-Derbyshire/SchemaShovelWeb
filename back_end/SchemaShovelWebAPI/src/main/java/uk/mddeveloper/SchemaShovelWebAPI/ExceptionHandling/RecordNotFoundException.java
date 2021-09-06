package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * A RuntimeException that represents a NOT_FOUND Http status
 * @author Matthew Derbyshire
 *
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecordNotFoundException extends RuntimeException {
	
	/**
	 * Constructor
	 */
	public RecordNotFoundException()
	{
		super();
	}
	
	/**
	 * Constructor with error message
	 * @param message The error message
	 */
	public RecordNotFoundException(String message)
	{
		super(message);
	}
	
	/**
	 * Constructor with error message and the original exception (so the stack trace is included)
	 * @param message The error message
	 * @param originalException The original exception, that contains the stack trace
	 */
	public RecordNotFoundException(String message, Throwable originalException)
	{
		super(message, originalException);
	}
	
}
