package uk.mddeveloper.SchemaShovelWebAPI.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

@Repository
public interface TableRepository extends JpaRepository<Table, Long> {
	
}
