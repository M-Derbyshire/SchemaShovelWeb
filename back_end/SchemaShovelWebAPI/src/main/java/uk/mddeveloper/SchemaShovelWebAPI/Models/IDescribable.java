package uk.mddeveloper.SchemaShovelWebAPI.Models;

/**
 * This interface represents entities that have description fields
 * @author Matthew Derbyshire
 *
 */
public interface IDescribable {
	
	/**
	 * Set the new description for the entity
	 * @param description The new description for the entity
	 */
	public void setDescription(String description);
	
	/**
	 * Get the description for the entity
	 * @return The description for the entity
	 */
	public String getDescription();	
	
}
