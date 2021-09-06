package uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections;

/**
 * A projection for "Database" entity models, that will contain only the name and ID of the model
 * @author Matthew Derbyshire
 *
 */
public interface DatabaseNameIdProjection {
	
	/**
	 * Get the ID of the model
	 * @return The ID of the model
	 */
	public Long getId();
	
	/**
	 * Get the name of the model
	 * @return The name of the model
	 */
	public String getName();
	
}
