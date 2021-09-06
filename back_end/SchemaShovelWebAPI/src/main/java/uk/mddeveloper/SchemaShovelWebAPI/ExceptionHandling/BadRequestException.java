package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * A RuntimeException that represents a BAD_REQUEST Http status
 * @author Matthew Derbyshire
 *
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

	/**
	 * Constructor
	 */
	public BadRequestException()
	{
		super();
	}
	
	/**
	 * Constructor with error message
	 * @param message The error message
	 */
	public BadRequestException(String message)
	{
		super(message);
	}
	
	/**
	 * Constructor with error message and the original exception (so the stack trace is included)
	 * @param message The error message
	 * @param originalException The original exception, that contains the stack trace
	 */
	public BadRequestException(String message, Throwable originalException)
	{
		super(message, originalException);
	}
	
}
