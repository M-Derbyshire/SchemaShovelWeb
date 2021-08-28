package uk.mddeveloper.SchemaShovelWebAPI.models.DescriptionOnlyHelperModel;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater.DescriptionOnlyHelperModel;

class DescriptionOnlyHelperModelUnitTests {

	@Test
	void willNotEditIdWhenGettingSetting() {
		
		long[] ids = { 1, 2, 34, 56 };
		
		for(long id: ids)
		{
			DescriptionOnlyHelperModel helper = new DescriptionOnlyHelperModel();
			helper.setId(id);
			assertThat(helper.getId()).isEqualTo(id);
		}
		
	}
	
	@Test
	void willNotEditDescriptionWhenGettingSetting() {
		
		String[] descs = { "test", "test1", "test32" };
		
		for(String desc : descs)
		{
			DescriptionOnlyHelperModel helper = new DescriptionOnlyHelperModel();
			helper.setDescription(desc);
			assertThat(helper.getDescription()).isEqualTo(desc);
		}
		
	}

}
