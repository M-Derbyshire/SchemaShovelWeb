package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections.DatabaseNameIdProjection;

/**
 * The repository for making changes to "Database" entities
 * @author Matthew Derbyshire
 *
 */
@Repository
public interface DatabaseRepository extends JpaRepository<Database, Long> {
	
	/**
	 * Gets a list of all records in the "Database" table, but just gets the ID and name for each
	 * @return A List of DatabaseNameIdProjection instances, representing all of the records in 
	 * the "database" table
	 */
	@Query(value="select d.id as id, d.name as name from Database d")
	public List<DatabaseNameIdProjection> findAllIdAndName();
	
	/**
	 * Runs a stored procedure to delete a "database" record, along with its child records (and their 
	 * children, etc)
	 * @param id The ID of the "database" record to be deleted
	 */
	@Procedure("spDeleteDatabaseRecordAndRelations")
	public void deleteRecordAndRelations(@Param("databaseID") Long id);
}