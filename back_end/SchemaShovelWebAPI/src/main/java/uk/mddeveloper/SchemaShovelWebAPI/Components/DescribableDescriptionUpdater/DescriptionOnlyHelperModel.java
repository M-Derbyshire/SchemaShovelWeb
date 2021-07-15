package uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class DescriptionOnlyHelperModel {
	
	public DescriptionOnlyHelperModel() {}
	
	@Id
	private Long id;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	private String description;
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
}
