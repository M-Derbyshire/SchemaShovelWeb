package uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import java.io.FileNotFoundException;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.dao.InvalidDataAccessApiUsageException;

class HttpStatusExceptionFactoryUnitTests {

	static HttpStatusExceptionFactory exFactory;
	
	@BeforeAll
	public static void init() {
		exFactory = new HttpStatusExceptionFactory();
	}
	
	@Test
	void whenGivenRecordNotFoundExWillReturnNewRecordNotFoundExWithSameMessageAndStackTrace() {
		
		String message = "test123shjasjadheh";
		Exception original = new RecordNotFoundException(message);
		
		Exception result = exFactory.createHttpStatusException(original);
		
		assertThat(result.equals(original)).isFalse();
		assertThat(result.getClass().equals(RecordNotFoundException.class)).isTrue(); //Test matches the exact same class
		assertThat(result.getMessage()).isEqualTo(message);
		assertThat(result.getCause() == original).isTrue();
	}
	
	@Test
	void whenGivenInvalidDataAccessApiUsageExWillReturnUnprocessableEntityExWithSameMessageAndStackTrace() {
		
		String message = "test123shjasjadheh";
		Exception original = new InvalidDataAccessApiUsageException(message);
		
		Exception result = exFactory.createHttpStatusException(original);
		
		assertThat(result.getClass().equals(UnprocessableEntityException.class)).isTrue(); //Test matches the exact same class
		assertThat(result.getMessage()).isEqualTo(message);
		assertThat(result.getCause() == original).isTrue();
		
	}
	
	@Test
	void whenGivenUnprocessableEntityExWillReturnNewUnprocessableEntityExWithSameMessageAndStackTrace() {
		
		String message = "test123shjasjadheh";
		Exception original = new UnprocessableEntityException(message);
		
		Exception result = exFactory.createHttpStatusException(original);
		
		assertThat(result.equals(original)).isFalse();
		assertThat(result.getClass().equals(UnprocessableEntityException.class)).isTrue(); //Test matches the exact same class
		assertThat(result.getMessage()).isEqualTo(message);
		assertThat(result.getCause() == original).isTrue();
		
	}
	
	@Test
	void whenGivenAnyOtherExWillReturnNewInternalServerErrorExWithSameMessageAndStackTrace() {
		
		String message = "test123shjasjadheh";
		Exception[] originals = { new Exception(message), new InternalServerErrorException(message), new FileNotFoundException(message) };
		
		for(Exception original : originals)
		{
			Exception result = exFactory.createHttpStatusException(original);
			
			assertThat(result.equals(original)).isFalse();
			assertThat(result.getClass().equals(InternalServerErrorException.class)).isTrue(); //Test matches the exact same class
			assertThat(result.getMessage()).isEqualTo(message);
			assertThat(result.getCause() == original).isTrue();
		}
		
	}

}
