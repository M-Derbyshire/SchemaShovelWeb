package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections.DatabaseNameIdProjection;

@Repository
public interface DatabaseRepository extends JpaRepository<Database, Long> {
	
	//Get just the name and id of the database
	@Query(value="select d.id as id, d.name as name from Database d")
	public List<DatabaseNameIdProjection> findAllIdAndName();
	
}
