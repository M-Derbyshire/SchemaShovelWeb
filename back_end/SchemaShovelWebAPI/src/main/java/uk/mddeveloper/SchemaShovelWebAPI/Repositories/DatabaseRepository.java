package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;

public interface DatabaseRepository extends JpaRepository<Database, Long> {
	
}
