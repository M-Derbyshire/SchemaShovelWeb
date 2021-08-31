package uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.HttpStatusExceptionFactory;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.SchemaRepository;

@ExtendWith(MockitoExtension.class)
class DescribableDescriptionUpdaterUnitTests {
	
	
	@Mock
	private HttpStatusExceptionFactory exFactory;
	
	@Mock
	private SchemaRepository schemaRepo;
	
	@InjectMocks
	private DescribableDescriptionUpdater<Schema> descUpdater;
	
	
	@Test
	void updateDescriptionWillUseTheGivenRepoToSaveNewDescriptionAndReturnDescObj() {
		
		Long id = (long) 1;
		String description = "testDesc12345";
		DescriptionOnlyHelperModel descModel = new DescriptionOnlyHelperModel();
		//Not setting ID, as that should be done in the updater method
		descModel.setDescription(description);
		
		Schema mockSchema = new Schema();
		mockSchema.setId(id);
		//Not setting description, as it will be set by the updater method
		
		when(schemaRepo.findById(id)).thenReturn(Optional.of(mockSchema));
		when(schemaRepo.save(mockSchema)).thenReturn(mockSchema);
		
		DescriptionOnlyHelperModel result = descUpdater.updateDescriptionWithGivenRepo(descModel, id, schemaRepo);
		
		assertThat(result.equals(descModel)).isTrue();
		assertThat(result.getDescription()).isEqualTo(description);
		assertThat(result.getId()).isEqualTo(id);
		assertThat(mockSchema.getDescription()).isEqualTo(description);
		
	}
	
	
	@Test
	void updateDescriptionWillThrowExceptionFromExceptionFactoryIfDescriptionNotSet()
	{
		
		//Not setting description
		DescriptionOnlyHelperModel descModel = new DescriptionOnlyHelperModel();
		
		RuntimeException mockException = new RuntimeException();
		
		when(exFactory.createHttpStatusException(any(Exception.class))).thenReturn(mockException);
		
		try
		{
			descUpdater.updateDescriptionWithGivenRepo(descModel, (long) 1, schemaRepo);
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e == mockException).isTrue();
		}
		
	}

}
