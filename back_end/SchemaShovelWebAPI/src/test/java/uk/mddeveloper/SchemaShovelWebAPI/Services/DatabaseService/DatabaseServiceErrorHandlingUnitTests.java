package uk.mddeveloper.SchemaShovelWebAPI.Services.DatabaseService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.AdditionalAnswers.returnsFirstArg;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier.DatabaseEntityIdentifier;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.HttpStatusExceptionFactory;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.InternalServerErrorException;
import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.RecordNotFoundException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Database;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.ColumnRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.DatabaseRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.SchemaRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Repositories.TableRepository;
import uk.mddeveloper.SchemaShovelWebAPI.Services.*;

@ExtendWith(MockitoExtension.class)
class DatabaseServiceErrorHandlingUnitTests {

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
	
	
	@Test
	void getAllWillThrowInternalServerErrorExceptionIfExceptionRaisedByRepo()
	{
		String message = "test123456";
		RuntimeException originalEx = new RuntimeException(message);
		
		when(databaseRepo.findAllIdAndName()).thenThrow(originalEx);
		
		try
		{
			databaseService.getAll();
			fail("Did not throw an exception");
		}
		catch(RuntimeException e)
		{
			assertThat(e.equals(originalEx)).isFalse();
			assertThat(e.getClass().equals(InternalServerErrorException.class)).isTrue(); //Test matches the exact same class
			assertThat(e.getMessage()).isEqualTo(message);
			assertThat(e.getCause() == originalEx).isTrue();
		}
		
	}
	
	
	
	@Test
	void getOneWillUseTheExceptionFactoryAndThrowThatException()
	{
		long id = (long) 1;
		RuntimeException originalRepoEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		
		when(databaseRepo.findById(id)).thenThrow(originalRepoEx);
		when(exFactory.createHttpStatusException(originalRepoEx)).thenReturn(factoryEx);
		
		try
		{
			databaseService.getOne(id);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).findById(id);
			verify(exFactory, times(1)).createHttpStatusException(originalRepoEx);
			assertThat(e == factoryEx).isTrue();
		}
	}
	
	
	
	
	@Test
	void updateWillPassRecordNotFoundExToExceptionFactoryAndThrowResult()
	{
		long id = (long) 1;
		RecordNotFoundException notFoundEx = new RecordNotFoundException();
		RuntimeException factoryEx = new RuntimeException();
		Database newNameDb = new Database();
		
		when(databaseRepo.findById(id)).thenThrow(notFoundEx);
		when(exFactory.createHttpStatusException(notFoundEx)).thenReturn(factoryEx);
		
		try
		{
			databaseService.update(newNameDb, id);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).findById(id);
			verify(exFactory, times(1)).createHttpStatusException(notFoundEx);
			assertThat(e == factoryEx).isTrue();
		}
		
	}
	
	@Test
	void updateWillPassSavingExceptionToExceptionFactoryAndThrowResult()
	{
		long id = (long) 1;
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		Database newNameDb = new Database();
		Database currentNameDb = new Database();
		currentNameDb.setId(id);
		newNameDb.setName("test");
		
		when(databaseRepo.findById(id)).thenReturn(Optional.of(currentNameDb));
		when(databaseRepo.saveAndFlush(currentNameDb)).thenThrow(originalEx);
		when(exFactory.createHttpStatusException(originalEx)).thenReturn(factoryEx);
		
		try
		{
			databaseService.update(newNameDb, id);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).saveAndFlush(currentNameDb);
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
		
	}
	
	@Test
	void updateWillPassIllegalArgExToExceptionFactoryAndThrowResult()
	{
		IllegalArgumentException illegalArgEx = new IllegalArgumentException();
		RuntimeException factoryEx = new RuntimeException();
		Database newNameDb = new Database();
		
		when(databaseRepo.findById(null)).thenThrow(illegalArgEx);
		when(exFactory.createHttpStatusException(illegalArgEx)).thenReturn(factoryEx);
		
		try
		{
			databaseService.update(newNameDb, null);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).findById(null);
			verify(exFactory, times(1)).createHttpStatusException(illegalArgEx);
			assertThat(e == factoryEx).isTrue();
		}
		
	}
	
	
	@Test
	void deleteWillPassARecordNotFoundExToExceptionFactoryAndThrowResult()
	{
		long id = (long) 1;
		RuntimeException notFoundEx = new RecordNotFoundException();
		RuntimeException factoryEx = new RuntimeException();
		
		when(databaseRepo.existsById(id)).thenReturn(false);
		lenient().doReturn(factoryEx).when(exFactory).createHttpStatusException(any());
		
		try
		{
			databaseService.delete(id);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).existsById(id);
			assertThat(e == factoryEx).isTrue();
		}
		
	}
	
	@Test
	void deleteWillPassDeletingExceptionToExceptionFactoryAndThrowResult()
	{
		long id = (long) 1;
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		Database currentDb = new Database();
		currentDb.setId(id);
		
		when(databaseRepo.existsById(id)).thenReturn(true);
		doThrow(originalEx).when(databaseRepo).deleteRecordAndRelations(id);
		when(exFactory.createHttpStatusException(originalEx)).thenReturn(factoryEx);
		
		try
		{
			databaseService.delete(id);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).deleteRecordAndRelations(id);
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
		
	}
	
	@Test
	void deleteWillPassIllegalArgExToExceptionFactoryAndThrowResult()
	{
		IllegalArgumentException illegalArgEx = new IllegalArgumentException();
		RuntimeException factoryEx = new RuntimeException();
		
		when(databaseRepo.existsById(null)).thenThrow(illegalArgEx);
		when(exFactory.createHttpStatusException(any(Exception.class))).thenReturn(factoryEx);
		
		try
		{
			databaseService.delete(null);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(databaseRepo, times(1)).existsById(null);
			assertThat(e == factoryEx).isTrue();
		}
		
	}
	
	
	
	
	@Test
	void createWillPassExceptionFromDatabaseRepoSaveAndFlushToExceptionFactoryAndThrowResult()
	{
		Column column = new Column();
		Table table = new Table();
		Schema schema = new Schema();
		Database newDb = new Database();
			
		table.setColumns(Arrays.asList(new Column[] { column }));
		schema.setTables(Arrays.asList(new Table[] { table }));
		newDb.setSchemas(Arrays.asList(new Schema[] { schema }));
		
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		
		//Returns first argument, but in a lenient way (these may or not be called, depending on
		//the implementation
		lenient().doAnswer(i -> i.getArguments()[0]).when(schemaRepo).saveAll(newDb.getSchemas());
		lenient().doAnswer(i -> i.getArguments()[0]).when(tableRepo).saveAll(schema.getTables());
		lenient().doAnswer(i -> i.getArguments()[0]).when(columnRepo).saveAll(table.getColumns());
		
		when(databaseRepo.saveAndFlush(newDb)).thenThrow(originalEx);
		when(exFactory.createHttpStatusException(originalEx)).thenThrow(factoryEx);
		
		
		try
		{
			databaseService.create(newDb);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
	}
	
	
	@Test
	void createWillPassExceptionFromSchemaRepoSaveAllToExceptionFactoryAndThrowResult()
	{
		Column column = new Column();
		Table table = new Table();
		Schema schema = new Schema();
		Database newDb = new Database();
			
		table.setColumns(Arrays.asList(new Column[] { column }));
		schema.setTables(Arrays.asList(new Table[] { table }));
		newDb.setSchemas(Arrays.asList(new Schema[] { schema }));
		
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		
		//Returns first argument, but in a lenient way (these may or not be called, depending on
		//the implementation
		lenient().doAnswer(i -> i.getArguments()[0]).when(databaseRepo).saveAndFlush(newDb);
		lenient().doAnswer(i -> i.getArguments()[0]).when(tableRepo).saveAll(schema.getTables());
		lenient().doAnswer(i -> i.getArguments()[0]).when(columnRepo).saveAll(table.getColumns());
		
		when(schemaRepo.saveAll(newDb.getSchemas())).thenThrow(originalEx);
		when(exFactory.createHttpStatusException(originalEx)).thenThrow(factoryEx);
		
		
		try
		{
			databaseService.create(newDb);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
	}
	
	
	@Test
	void createWillPassExceptionFromTableRepoSaveAllToExceptionFactoryAndThrowResult()
	{
		Column column = new Column();
		Table table = new Table();
		Schema schema = new Schema();
		Database newDb = new Database();
			
		table.setColumns(Arrays.asList(new Column[] { column }));
		schema.setTables(Arrays.asList(new Table[] { table }));
		newDb.setSchemas(Arrays.asList(new Schema[] { schema }));
		
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		
		//Returns first argument, but in a lenient way (these may or not be called, depending on
		//the implementation
		lenient().doAnswer(i -> i.getArguments()[0]).when(databaseRepo).saveAndFlush(newDb);
		lenient().doAnswer(i -> i.getArguments()[0]).when(schemaRepo).saveAll(newDb.getSchemas());
		lenient().doAnswer(i -> i.getArguments()[0]).when(columnRepo).saveAll(table.getColumns());
		
		when(tableRepo.saveAll(schema.getTables())).thenThrow(originalEx);
		when(exFactory.createHttpStatusException(originalEx)).thenThrow(factoryEx);
		
		
		try
		{
			databaseService.create(newDb);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
	}
	
	
	@Test
	void createWillPassExceptionFromColumnRepoSaveAllToExceptionFactoryAndThrowResult()
	{
		Column column = new Column();
		Table table = new Table();
		Schema schema = new Schema();
		Database newDb = new Database();
			
		table.setColumns(Arrays.asList(new Column[] { column }));
		schema.setTables(Arrays.asList(new Table[] { table }));
		newDb.setSchemas(Arrays.asList(new Schema[] { schema }));
		
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		
		//Returns first argument, but in a lenient way (these may or not be called, depending on
		//the implementation
		lenient().doAnswer(i -> i.getArguments()[0]).when(databaseRepo).saveAndFlush(newDb);
		lenient().doAnswer(i -> i.getArguments()[0]).when(schemaRepo).saveAll(newDb.getSchemas());
		lenient().doAnswer(i -> i.getArguments()[0]).when(tableRepo).saveAll(schema.getTables());
		
		when(columnRepo.saveAll(table.getColumns())).thenThrow(originalEx);
		when(exFactory.createHttpStatusException(originalEx)).thenThrow(factoryEx);
		
		
		try
		{
			databaseService.create(newDb);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
	}
	
	
	@Test
	void createWillPassExceptionFromDatabaseEntityIdentifierToExceptionFactoryAndThrowResult()
	{
		Column column = new Column();
		Table table = new Table();
		Schema schema = new Schema();
		Database newDb = new Database();
		
		column.setFkToTableStr("Doesnt_exist");		
		table.setColumns(Arrays.asList(new Column[] { column }));
		schema.setTables(Arrays.asList(new Table[] { table }));
		newDb.setSchemas(Arrays.asList(new Schema[] { schema }));
		
		RuntimeException originalEx = new RuntimeException();
		RuntimeException factoryEx = new RuntimeException();
		
		//Returns first argument, but in a lenient way (these may or not be called, depending on
		//the implementation
		lenient().doAnswer(i -> i.getArguments()[0]).when(databaseRepo).saveAndFlush(newDb);
		lenient().doAnswer(i -> i.getArguments()[0]).when(schemaRepo).saveAll(newDb.getSchemas());
		lenient().doAnswer(i -> i.getArguments()[0]).when(tableRepo).saveAll(schema.getTables());
		lenient().doAnswer(i -> i.getArguments()[0]).when(columnRepo).saveAll(table.getColumns());
		
		
		when(databaseEntityIdentifier.getTableAtPath(
				newDb.getSchemas(), 
				column.getFkToTableStr()
			)).thenThrow(originalEx);
		
		when(exFactory.createHttpStatusException(originalEx)).thenThrow(factoryEx);
		
		
		try
		{
			databaseService.create(newDb);
			fail("No exception was thrown");
		}
		catch(RuntimeException e)
		{
			verify(exFactory, times(1)).createHttpStatusException(originalEx);
			assertThat(e == factoryEx).isTrue();
		}
	}
	
}
