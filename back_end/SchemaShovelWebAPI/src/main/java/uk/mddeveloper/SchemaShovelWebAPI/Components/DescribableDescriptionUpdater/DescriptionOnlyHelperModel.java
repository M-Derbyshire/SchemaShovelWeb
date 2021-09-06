package uk.mddeveloper.SchemaShovelWebAPI.Components.DescribableDescriptionUpdater;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * A helper-model, for use when updating the description of IDescribable models
 * 
 * @author Matthew Derbyshire
 *
 */
@Entity
public class DescriptionOnlyHelperModel {
	
	/**
	 * Constructor
	 */
	public DescriptionOnlyHelperModel() {}
	
	//This can be null if coming into the API, as we're not actually using it 
	//when setting new descriptions. This is more for data going out
	@Id
	private Long id;
	
	/**
	 * Get the ID of the model
	 * @return The ID of the model
	 */
	public Long getId() {
		return id;
	}

	/**
	 * Set the ID of the model
	 * @param id The new ID for the model
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	@NotNull(message = "Description cannot be null")
	private String description;
	
	/**
	 * Get the description of the model
	 * @return The description of the model
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * Set the description of the model (this has a not-null validation constraint)
	 * @param description The new description for the model
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	
}
