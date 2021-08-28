package uk.mddeveloper.SchemaShovelWebAPI.models.Database;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;

class DatabaseUnitTest {

	@Test
	void willNotEditIdWhenGettingSetting() {
		
		long[] ids = { 1, 2, 34, 56 };
		
		for(long id: ids)
		{
			Database db = new Database();
			db.setId(id);
			assertThat(db.getId()).isEqualTo(id);
		}
		
	}
	
	@Test
	void willNotEditNameWhenGettingSetting() {
		
		String[] names = { "test", "test1", "test32" };
		
		for(String name : names)
		{
			Database db = new Database();
			db.setName(name);
			assertThat(db.getName()).isEqualTo(name);
		}
		
	}

}
