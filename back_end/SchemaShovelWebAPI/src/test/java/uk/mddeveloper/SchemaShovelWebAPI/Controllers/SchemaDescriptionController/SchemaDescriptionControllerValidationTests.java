package uk.mddeveloper.SchemaShovelWebAPI.Controllers.SchemaDescriptionController;

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
public class SchemaDescriptionControllerValidationTests {
	
	@Autowired
    private MockMvc mockMvc;
	
	
	@Test
	void updateWithDescAsNullWillReturnValidationError() throws Exception {
		
		String schemaJSON = "{ \"description\": null, \"id\": 1 }";
		
		mockMvc.perform(MockMvcRequestBuilders.patch("/api/v1/schemas/update_description/1")
			.content(schemaJSON)
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(MockMvcResultMatchers.status().isBadRequest())
			.andExpect(MockMvcResultMatchers.jsonPath(
					"$.description", Is.is("Description cannot be null")))
		    .andExpect(MockMvcResultMatchers.content()
		    .contentType(MediaType.APPLICATION_JSON));
	}
	
}
