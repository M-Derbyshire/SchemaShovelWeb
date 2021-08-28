package uk.mddeveloper.SchemaShovelWebAPI.models.Column;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;

class ColumnUnitTests {

	@Test
	void willNotEditIdWhenGettingSetting() {
		
		long[] ids = { 1, 2, 34, 56 };
		
		for(long id: ids)
		{
			Column column = new Column();
			column.setId(id);
			assertThat(column.getId()).isEqualTo(id);
		}
		
	}
	
	@Test
	void willNotEditNameWhenGettingSetting() {
		
		String[] names = { "test", "test1", "test32" };
		
		for(String name : names)
		{
			Column column = new Column();
			column.setName(name);
			assertThat(column.getName()).isEqualTo(name);
		}
		
	}
	
	@Test
	void willNotEditDescriptionWhenGettingSetting() {
		
		String[] descs = { "test", "test1", "test32" };
		
		for(String desc : descs)
		{
			Column column = new Column();
			column.setDescription(desc);
			assertThat(column.getDescription()).isEqualTo(desc);
		}
		
	}
	
	@Test
	void willNotEditFkToTableStrWhenGettingSetting() {
		
		String[] fks = { "test", "test1", "test32" };
		
		for(String fk : fks)
		{
			Column column = new Column();
			column.setFkToTableStr(fk);
			assertThat(column.getFkToTableStr()).isEqualTo(fk);
		}
		
	}

}
