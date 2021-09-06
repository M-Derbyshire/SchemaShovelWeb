package uk.mddeveloper.SchemaShovelWebAPI.Models;

/**
 * This interface represents entities that have name fields
 * @author Matthew Derbyshire
 *
 */
public interface INameable {
	
	/**
	 * Set the new name for the entity
	 * @param name The new name for the entity
	 */
	public void setName(String name);
	
	/**
	 * Get the name for the entity
	 * @return The name for the entity
	 */
	public String getName();	
	
}
