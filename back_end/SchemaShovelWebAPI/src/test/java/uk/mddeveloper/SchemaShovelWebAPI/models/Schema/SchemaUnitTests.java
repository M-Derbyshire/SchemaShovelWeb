package uk.mddeveloper.SchemaShovelWebAPI.models.Schema;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;


class SchemaUnitTests {

	@Test
	void willNotEditIdWhenGettingSetting() {
		
		long[] ids = { 1, 2, 34, 56 };
		
		for(long id: ids)
		{
			Schema schema = new Schema();
			schema.setId(id);
			assertThat(schema.getId()).isEqualTo(id);
		}
		
	}
	
	@Test
	void willNotEditNameWhenGettingSetting() {
		
		String[] names = { "test", "test1", "test32" };
		
		for(String name : names)
		{
			Schema schema = new Schema();
			schema.setName(name);
			assertThat(schema.getName()).isEqualTo(name);
		}
		
	}
	
	@Test
	void willNotEditDescriptionWhenGettingSetting() {
		
		String[] descs = { "test", "test1", "test32" };
		
		for(String desc : descs)
		{
			Schema schema = new Schema();
			schema.setDescription(desc);
			assertThat(schema.getDescription()).isEqualTo(desc);
		}
		
	}
	
}
