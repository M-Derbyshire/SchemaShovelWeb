package uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Entity
public class DescriptionOnlyHelperModel {
	
	public DescriptionOnlyHelperModel() {}
	
	//This can be null if coming into the API, as we're not actually using it 
	//when setting new descriptions. This is more for data going out
	@Id
	private Long id;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@NotNull(message = "Description cannot be null")
	private String description;
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}
