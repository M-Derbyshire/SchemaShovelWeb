package uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

class DatabaseEntityIdentifierErrorHandlingUnitTests {
	
static DatabaseEntityIdentifier identifier;
	
	@BeforeAll
	public static void init()
	{
		identifier = new DatabaseEntityIdentifier();
	}
	
	@Test
	void getTableAtPathWillThrowUnprocessableEntityExIfTablePathIsInvalid() {
		
		Column col = new Column();
		col.setName("match");
		Table tab = new Table();
		tab.setName("match");
		tab.setColumns(Arrays.asList(col));
		Schema sch = new Schema();
		sch.setName("match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getTableAtPath(Arrays.asList(sch), "match"); //incorrectly shaped path
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}
	
	@Test
	void getTableAtPathWillThrowUnprocessableEntityExIfNoMatchingSchema() {
		
		Column col = new Column();
		col.setName("match");
		Table tab = new Table();
		tab.setName("match");
		tab.setColumns(Arrays.asList(col));
		
		Schema sch = new Schema();
		sch.setName("no_match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getTableAtPath(Arrays.asList(sch), "match.match");
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}
	
	@Test
	void getTableAtPathWillThrowUnprocessableEntityExIfNoMatchingTable() {
		
		Column col = new Column();
		col.setName("match");
		Table tab = new Table();
		
		tab.setName("no_match");
		tab.setColumns(Arrays.asList(col));
		
		Schema sch = new Schema();
		sch.setName("match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getTableAtPath(Arrays.asList(sch), "match.match");
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}
	
	
	
	@Test
	void getColumnAtPathWillThrowUnprocessableEntityExIfColumnPathIsInvalid() {
		
		Column col = new Column();
		col.setName("match");
		Table tab = new Table();
		tab.setName("match");
		tab.setColumns(Arrays.asList(col));
		Schema sch = new Schema();
		sch.setName("match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getColumnAtPath(Arrays.asList(sch), "match.match"); //incorrectly shaped path
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}
	
	@Test
	void getColumnAtPathWillThrowUnprocessableEntityExIfNoMatchingSchema() {
		
		Column col = new Column();
		col.setName("match");
		Table tab = new Table();
		tab.setName("match");
		tab.setColumns(Arrays.asList(col));
		
		Schema sch = new Schema();
		sch.setName("no_match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getColumnAtPath(Arrays.asList(sch), "match.match.match");
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}
	
	@Test
	void getColumnAtPathWillThrowUnprocessableEntityExIfNoMatchingTable() {
		
		Column col = new Column();
		col.setName("match");
		Table tab = new Table();
		
		tab.setName("no_match");
		tab.setColumns(Arrays.asList(col));
		
		Schema sch = new Schema();
		sch.setName("match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getColumnAtPath(Arrays.asList(sch), "match.match.match");
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}
	
	@Test
	void getColumnAtPathWillThrowUnprocessableEntityExIfNoMatchingColumn() {
		
		Column col = new Column();
		col.setName("no_match");
		Table tab = new Table();
		
		tab.setName("match");
		tab.setColumns(Arrays.asList(col));
		
		Schema sch = new Schema();
		sch.setName("match");
		sch.setTables(Arrays.asList(tab));
		
		try
		{
			identifier.getColumnAtPath(Arrays.asList(sch), "match.match.match");
			fail("An exception was not thrown");
		}
		catch(Exception e)
		{
			assertThat(e.getClass().equals(UnprocessableEntityException.class)).isTrue();
		}
	}

}
