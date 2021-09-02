package uk.mddeveloper.SchemaShovelWebAPI.Controllers.ColumnDescriptionController;

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
import uk.mddeveloper.SchemaShovelWebAPI.Controllers.EntityDescriptionUpdate.ColumnDescriptionController;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;

@ExtendWith(MockitoExtension.class)
public class ColumnDescriptionControllerUnitTests {
	
	@Autowired
	private ColumnRepository repo;
	
	@Mock
	private DescribableDescriptionUpdater<Column> descriptionUpdater;
	
	@InjectMocks
	private ColumnDescriptionController controller;
	
	
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
