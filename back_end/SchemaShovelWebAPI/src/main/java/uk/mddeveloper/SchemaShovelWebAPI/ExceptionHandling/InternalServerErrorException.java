package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * A RuntimeException that represents an INTERNAL_SERVER_ERROR Http status
 * @author Matthew Derbyshire
 *
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class InternalServerErrorException extends RuntimeException {
	
	/**
	 * Constructor
	 */
	public InternalServerErrorException()
	{
		super();
	}
	
	/**
	 * Constructor with error message
	 * @param message The error message
	 */
	public InternalServerErrorException(String message)
	{
		super(message);
	}
	
	/**
	 * Constructor with error message and the original exception (so the stack trace is included)
	 * @param message The error message
	 * @param originalException The original exception, that contains the stack trace
	 */
	public InternalServerErrorException(String message, Throwable originalException)
	{
		super(message, originalException);
	}
}
