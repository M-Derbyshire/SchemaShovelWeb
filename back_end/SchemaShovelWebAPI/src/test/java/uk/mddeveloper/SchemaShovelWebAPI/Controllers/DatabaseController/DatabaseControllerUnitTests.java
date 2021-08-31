package uk.mddeveloper.SchemaShovelWebAPI.Controllers.DatabaseController;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;

import uk.mddeveloper.SchemaShovelWebAPI.Controllers.*;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections.DatabaseNameIdProjection;
import uk.mddeveloper.SchemaShovelWebAPI.Services.*;

@ExtendWith(MockitoExtension.class)
public class DatabaseControllerUnitTests {
	
	@Mock
	private DatabaseService databaseService;
	
	@InjectMocks
	private DatabaseController databaseController;
	
	ProjectionFactory projectionFactory = new SpelAwareProxyProjectionFactory();
	
	
	@Test
	void getAllWillUseAndReturnServiceGetAll() {
		
		List<DatabaseNameIdProjection> dbs = new ArrayList<DatabaseNameIdProjection>();
		dbs.add(projectionFactory.createProjection(DatabaseNameIdProjection.class));
		
		when(databaseService.getAll()).thenReturn(dbs);
		
		List<DatabaseNameIdProjection> result = databaseController.getAll();
		
		verify(databaseService, times(1)).getAll();
		assertThat(result == dbs).isTrue();
	}
	
	
	
	@Test
	void getOneWillUseAndReturnServiceGetOne() {
		
		Database db = new Database();
		long id = 1;
		
		when(databaseService.getOne(id)).thenReturn(db);
		
		Database result = databaseController.getOne(id);
		
		verify(databaseService, times(1)).getOne(id);
		assertThat(result == db).isTrue();
	}
	
	
	@Test
	void createWillUseAndReturnServiceCreate() {
		
		Database db = new Database();
		
		when(databaseService.create(db)).thenReturn(db);
		
		Database result = databaseController.create(db);
		
		verify(databaseService, times(1)).create(db);
		assertThat(result == db).isTrue();
	}
	
	
	@Test
	void updateWillUseReturnServiceUpdate() {
		
		Database db = new Database();
		Database updatedDB = new Database();
		long id = 1;
		
		when(databaseService.update(db, id)).thenReturn(updatedDB);
		
		Database result = databaseController.update(db, id);
		
		verify(databaseService, times(1)).update(db, id);
		assertThat(result == updatedDB).isTrue();
	}
	
	
	@Test
	void deleteWillUseServiceDelete() {
		
		long id = 1;
		
		doNothing().when(databaseService).delete(id);
		
		databaseController.delete(id);
		
		verify(databaseService, times(1)).delete(id);
	}
	
}
