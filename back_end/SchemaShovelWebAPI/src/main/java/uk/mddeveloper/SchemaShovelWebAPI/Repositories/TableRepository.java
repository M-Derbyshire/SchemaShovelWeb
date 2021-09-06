package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

/**
 * The repository for making changes to "Table" entities
 * @author Matthew Derbyshire
 *
 */
@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
	
}
