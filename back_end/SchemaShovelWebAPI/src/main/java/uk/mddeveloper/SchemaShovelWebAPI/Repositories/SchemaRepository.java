package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;

public interface SchemaRepository extends  JpaRepository<Schema, Long>  {
	
}
