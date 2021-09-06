package uk.mddeveloper.SchemaShovelWebAPI.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * The superclass for all controllers in the system. This provides exception handling for 
 * validation errors
 * @author Matthew Derbyshire
 *
 */
@RestController
public class Controller {
	
	/**
	 * Provides exception handling for model-validation errors
	 * @param e The exception that contains the validation errors
	 * @return A map of the validation errors
	 */
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException e) {
	    
		Map<String, String> errors = new HashMap<>();
		
		for(ObjectError err : e.getBindingResult().getAllErrors())
		{
			String key = ((FieldError) err).getField();
			String value = err.getDefaultMessage();
			
			errors.put(key, value);
		}
		
	    return errors;
	}
	
}
