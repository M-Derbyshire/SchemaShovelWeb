package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;

public interface ColumnRepository extends JpaRepository<Column, Long> {
	
}
