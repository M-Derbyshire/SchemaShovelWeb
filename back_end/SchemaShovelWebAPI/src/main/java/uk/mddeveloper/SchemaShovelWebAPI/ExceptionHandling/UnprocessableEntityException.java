package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * A RuntimeException that represents an UNPROCESSABLE_ENTITY Http status
 * @author Matthew Derbyshire
 *
 */
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class UnprocessableEntityException extends RuntimeException {
	
	/**
	 * Constructor
	 */
	public UnprocessableEntityException()
	{
		super();
	}
	
	/**
	 * Constructor with error message
	 * @param message The error message
	 */
	public UnprocessableEntityException(String message)
	{
		super(message);
	}
	
	/**
	 * Constructor with error message and the original exception (so the stack trace is included)
	 * @param message The error message
	 * @param originalException The original exception, that contains the stack trace
	 */
	public UnprocessableEntityException(String message, Throwable originalException)
	{
		super(message, originalException);
	}	
}