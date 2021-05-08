package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;

@Repository
public interface SchemaRepository extends  JpaRepository<Schema, Long>  {
	
}
