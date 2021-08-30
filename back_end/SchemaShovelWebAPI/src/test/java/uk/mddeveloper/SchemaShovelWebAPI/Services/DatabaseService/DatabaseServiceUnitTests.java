package uk.mddeveloper.SchemaShovelWebAPI.Services.DatabaseService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier.DatabaseEntityIdentifier;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.HttpStatusExceptionFactory;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.DatabaseRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.SchemaRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.TableRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.Projections.DatabaseNameIdProjection;
import uk.mddeveloper.SchemaShovelWebAPI.Services.*;

@ExtendWith(MockitoExtension.class)
class DatabaseServiceUnitTests {

	@Mock
	private HttpStatusExceptionFactory exFactory;
	@Mock
	private DatabaseEntityIdentifier databaseEntityIdentifier;
	@Mock
	private DatabaseRepository databaseRepo;
	@Mock
	private SchemaRepository schemaRepo;
	@Mock
	private TableRepository tableRepo;
	@Mock
	private ColumnRepository columnRepo;
	
	@InjectMocks
	private DatabaseService databaseService;
	
	ProjectionFactory projectionFactory = new SpelAwareProxyProjectionFactory();
	
	
	
	@BeforeEach
	void init() {
		lenient().doAnswer(i -> i.getArguments()[0]).when(exFactory).createHttpStatusException(any());
	}
	
	
	
	@Test
	void getAllWillCallDbRepoFindAllIdAndName() {
		
		List<DatabaseNameIdProjection> projections = new ArrayList<DatabaseNameIdProjection>();
		projections.add(projectionFactory.createProjection(DatabaseNameIdProjection.class));
		
		when(databaseRepo.findAllIdAndName()).thenReturn(projections);
		
		
		List<DatabaseNameIdProjection> results = databaseService.getAll();
		
		assertThat(results.get(0) == projections.get(0)).isTrue();
	}
	
	
	@Test
	void getOneWillCallDbRepoFindByIdWithTheGivenId() {
		
		//Cleaner to just use ints and cast when passing in
		int ids[] = { 1, 2, 34, 67 };
		
		for(int id : ids)
		{
			Database db = new Database();
			when(databaseRepo.findById((long) id)).thenReturn(Optional.of(db));
			
			Database result = databaseService.getOne((long) id);
			
			assertThat(result == db).isTrue();
		
		}
		
	}
	
	
	@Test
	void updateWillUpdateTheNameAndReturnTheUpdatedEntity() {
		
		String[] names = { "test1", "test2", "test34" };
		
		for(String name : names)
		{
			Database db = new Database();
			db.setName("oldName");
			Database newDb = new Database();
			newDb.setName(name);
			
			when(databaseRepo.findById((long) 1)).thenReturn(Optional.of(db));
			when(databaseRepo.saveAndFlush(db)).thenReturn(db);
			
			Database result = databaseService.update(newDb, (long) 1);
			
			assertThat(result == db).isTrue();
			assertThat(result.getName()).isEqualTo(name);
		}
		
	}
	
	
	@Test
	void deleteWillCallDbRepoDeleteRecordAndRelationsWithId() {
		
		//Cleaner to use ints and cast when needed, rather than doing them now
		int[] ids = { 1, 2, 34, 56 };
		
		for(int idInt : ids)
		{
			long id = (long) idInt;
			
			when(databaseRepo.existsById(id)).thenReturn(true);
			
			databaseService.delete(id);
			
			verify(databaseRepo).existsById(id);
			verify(databaseRepo).deleteRecordAndRelations(id);
		}
	}
	
	
	@Test
	void createWillMapTheGivenStructureToTheDb()
	{
		int columnListLength = 2;
			
		List<Column> schema1Table1Columns = new ArrayList<Column>();
		List<Column> schema1Table2Columns = new ArrayList<Column>();
		List<Column> schema2Table1Columns = new ArrayList<Column>();
		List<Column> schema2Table2Columns = new ArrayList<Column>();
		for(int i = 0; i < columnListLength; i++)
		{
			schema1Table1Columns.add(new Column());
			schema1Table2Columns.add(new Column());
			schema2Table1Columns.add(new Column());
			schema2Table2Columns.add(new Column());
		}
		
		Table schema1Table1 = new Table();
		Table schema1Table2 = new Table();
		Table schema2Table1 = new Table();
		Table schema2Table2 = new Table();
		schema1Table1.setColumns(schema1Table1Columns);
		schema1Table2.setColumns(schema1Table2Columns);
		schema2Table1.setColumns(schema2Table1Columns);
		schema2Table2.setColumns(schema2Table2Columns);
		
		Schema schema1 = new Schema();
		Schema schema2 = new Schema();
		schema1.setTables(Arrays.asList(new Table[] {schema1Table1, schema1Table2}));
		schema2.setTables(Arrays.asList(new Table[] {schema2Table1, schema2Table2}));
		
		Database db = new Database();
		db.setSchemas(Arrays.asList(new Schema[] {schema1, schema2}));
		
		//Using doAnswer instead of returnsFirstArg, to solve issues with saveAll seeing Iterables 
		//instead of Lists. 
		//See https://stackoverflow.com/questions/41505923/mockito-wrongtypeofreturnvalue-iterable-instead-of-list
		lenient().doAnswer(i -> i.getArguments()[0]).when(databaseRepo).saveAndFlush(any());
		lenient().doAnswer(i -> i.getArguments()[0]).when(schemaRepo).saveAll(any());
		lenient().doAnswer(i -> i.getArguments()[0]).when(tableRepo).saveAll(any());
		lenient().doAnswer(i -> i.getArguments()[0]).when(columnRepo).saveAll(any());
		
		
		Database result = databaseService.create(db);
		
		assertThat(result == db).isTrue();
		verify(databaseRepo, times(1)).saveAndFlush(db);
		
		verify(schemaRepo, times(1)).saveAll(db.getSchemas());
		verify(tableRepo, times(1)).saveAll(schema1.getTables());
		verify(tableRepo, times(1)).saveAll(schema2.getTables());
		verify(columnRepo, times(1)).saveAll(schema1Table1.getColumns());
		verify(columnRepo, times(1)).saveAll(schema1Table2.getColumns());
		verify(columnRepo, times(1)).saveAll(schema2Table1.getColumns());
		verify(columnRepo, times(1)).saveAll(schema2Table2.getColumns());
	}
	
	
	
	@Test
	void createWillUseEntityIdentifierToGetTableIdIfFkIsSet() {
		
		String tablePath = "schema1.table1";
		
		Column colWithFk = new Column();
		colWithFk.setFkToTableStr(tablePath);
		
		Column colNoFk = new Column();
		
		Table tab = new Table();
		tab.setColumns(Arrays.asList(new Column[] { colWithFk, colNoFk }));
		
		Schema schema = new Schema();
		schema.setTables(Arrays.asList(new Table[] { tab }));
		
		Database db = new Database();
		db.setSchemas(Arrays.asList(new Schema[] { schema }));
		
		
		when(databaseEntityIdentifier.getTableAtPath(db.getSchemas(), tablePath)).thenReturn(tab);
		
		lenient().doAnswer(i -> i.getArguments()[0]).when(databaseRepo).saveAndFlush(any());
		lenient().doAnswer(i -> i.getArguments()[0]).when(schemaRepo).saveAll(any());
		lenient().doAnswer(i -> i.getArguments()[0]).when(tableRepo).saveAll(any());
		lenient().doAnswer(i -> i.getArguments()[0]).when(columnRepo).saveAll(any());
		
		
		Database result = databaseService.create(db);
		
		verify(databaseEntityIdentifier, times(1)).getTableAtPath(any(), any());
		assertThat(db.getSchemas().get(0).getTables().get(0).getColumns().get(0).getFkToTable())
			.isEqualTo(tab);
	}

}
