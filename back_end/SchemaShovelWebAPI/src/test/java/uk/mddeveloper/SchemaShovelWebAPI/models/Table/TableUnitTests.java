package uk.mddeveloper.SchemaShovelWebAPI.models.Table;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

class TableUnitTests {

	@Test
	void willNotEditIdWhenGettingSetting() {
		
		long[] ids = { 1, 2, 34, 56 };
		
		for(long id: ids)
		{
			Table table = new Table();
			table.setId(id);
			assertThat(table.getId()).isEqualTo(id);
		}
		
	}
	
	@Test
	void willNotEditNameWhenGettingSetting() {
		
		String[] names = { "test", "test1", "test32" };
		
		for(String name : names)
		{
			Table table = new Table();
			table.setName(name);
			assertThat(table.getName()).isEqualTo(name);
		}
		
	}
	
	@Test
	void willNotEditDescriptionWhenGettingSetting() {
		
		String[] descs = { "test", "test1", "test32" };
		
		for(String desc : descs)
		{
			Table table = new Table();
			table.setDescription(desc);
			assertThat(table.getDescription()).isEqualTo(desc);
		}
		
	}

}
