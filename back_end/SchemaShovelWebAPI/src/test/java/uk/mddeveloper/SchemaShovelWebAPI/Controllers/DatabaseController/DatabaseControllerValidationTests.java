package uk.mddeveloper.SchemaShovelWebAPI.Controllers.DatabaseController;

import org.hamcrest.core.Is;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class DatabaseControllerValidationTests {
	
	@Autowired
    private MockMvc mockMvc;
	
	
	@Test
	void creationWithDBNameAsNullWillReturnValidationError() throws Exception {
		
		String dbJSON = "{ \"name\": null, \"schemas\": [] }";
		
		mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/databases")
			.content(dbJSON)
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(MockMvcResultMatchers.status().isBadRequest())
			.andExpect(MockMvcResultMatchers.jsonPath("$.name", Is.is("Name must be provided")))
		    .andExpect(MockMvcResultMatchers.content()
		    .contentType(MediaType.APPLICATION_JSON));
	}
	
	@Test
	void updateWithDBNameAsNullWillReturnValidationError() throws Exception {
		
		String dbJSON = "{ \"name\": null, \"schemas\": [], \"id\": 1 }";
		
		mockMvc.perform(MockMvcRequestBuilders.patch("/api/v1/databases/1")
			.content(dbJSON)
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(MockMvcResultMatchers.status().isBadRequest())
			.andExpect(MockMvcResultMatchers.jsonPath("$.name", Is.is("Name must be provided")))
		    .andExpect(MockMvcResultMatchers.content()
		    .contentType(MediaType.APPLICATION_JSON));
	}

}