package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;

/**
 * The repository for making changes to "Column" entities
 * @author Matthew Derbyshire
 *
 */
@Repository
public interface ColumnRepository extends JpaRepository<Column, Long> {
	
}
