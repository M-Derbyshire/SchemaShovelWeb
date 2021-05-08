package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

public interface TableRepository extends JpaRepository<Table, Long> {
	
}
