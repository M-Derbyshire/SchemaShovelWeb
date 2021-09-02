package uk.mddeveloper.SchemaShovelWebAPI.Controllers.TableDescriptionController;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater.DescribableDescriptionUpdater;
import uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater.DescriptionOnlyHelperModel;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.Controller;
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate.TableDescriptionController;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.TableRepository;

@ExtendWith(MockitoExtension.class)
public class TableDescriptionControllerUnitTests {
	
	@Autowired
	private TableRepository repo;
	
	@Mock
	private DescribableDescriptionUpdater<Table> descriptionUpdater;
	
	@InjectMocks
	private TableDescriptionController controller;
	
	
	@Test
	void updateDescriptionWillCallAndReturnFromDescriptionUpdater() throws Throwable {
		
		DescriptionOnlyHelperModel newDesc = new DescriptionOnlyHelperModel();
		DescriptionOnlyHelperModel returnDesc = new DescriptionOnlyHelperModel();
		long id = 1;
		
		when(descriptionUpdater.updateDescriptionWithGivenRepo(newDesc, id, repo))
			.thenReturn(returnDesc);
		
		DescriptionOnlyHelperModel result = controller.updateDescription(newDesc, id);
		
		verify(descriptionUpdater, times(1)).updateDescriptionWithGivenRepo(newDesc, id, repo);
		assertThat(result == returnDesc).isTrue();
	}
	
	
	@Test
	void classExtendsSuperController()
	{
		assertThat(controller instanceof Controller).isTrue();
	}
	
}
