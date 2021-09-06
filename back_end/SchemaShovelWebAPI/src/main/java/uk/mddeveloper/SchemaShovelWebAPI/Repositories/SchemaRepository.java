package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;

/**
 * The repository for making changes to "Schema" entities
 * @author Matthew Derbyshire
 *
 */
@Repository
public interface SchemaRepository extends  JpaRepository<Schema, Long>  {
	
}
