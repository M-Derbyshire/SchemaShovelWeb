package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;

@Repository
public interface DatabaseRepository extends JpaRepository<Database, Long> {
	
}
