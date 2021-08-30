package uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier.DatabaseEntityIdentifier;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

class DatabaseEntityIdentifierUnitTests {

	static DatabaseEntityIdentifier identifier;
	
	@BeforeAll
	public static void init()
	{
		identifier = new DatabaseEntityIdentifier();
	}
	
	@Test
	void isValidTablePathWillCorrectlyDetermineIfTheGivenPathIsCorrect()
	{
		String[] correctPaths = { "schema.table", "s1.t1", "ahjasdh.djashjdh" };
		String[] incorrectPaths = { "schema", "s1.t1.c1", "ahsdhadhjsdhkjahd" };
		
		for(String correctPath : correctPaths)
		{
			assertThat(identifier.isValidTablePath(correctPath)).isTrue();
		}
		
		for(String incorrectPath : incorrectPaths)
		{
			assertThat(identifier.isValidTablePath(incorrectPath)).isFalse();
		}
	}
	
	@Test
	void isValidColumnPathWillCorrectlyDetermineIfTheGivenPathIsCorrect()
	{
		String[] correctPaths = { "schema.table.column", "s1.t1.c1", "ahjasdh.djashjdh.jkahdjakshd" };
		String[] incorrectPaths = { "schema", "s1.t1", "ahsdhadhjsdhkjahd" };
		
		for(String correctPath : correctPaths)
		{
			assertThat(identifier.isValidColumnPath(correctPath)).isTrue();
		}
		
		for(String incorrectPath : incorrectPaths)
		{
			assertThat(identifier.isValidColumnPath(incorrectPath)).isFalse();
		}
	}
	
	
	@Test
	void getTableAtPathWillFindTheCorrectTable()
	{
		Table matchTable = new Table();
		matchTable.setName("match");
		
		List<Table> tables1 = Arrays.asList(new Table(), new Table());
		tables1.get(0).setName("noMatch");
		tables1.get(1).setName("noMatch");
		
		List<Table> tables2 = Arrays.asList(matchTable, new Table());
		tables2.get(1).setName("noMatch");
		
		
		
		Schema withoutMatch = new Schema();
		withoutMatch.setName("noMatch");
		withoutMatch.setTables(tables1);
		
		Schema withMatch = new Schema();
		withMatch.setName("match");
		withMatch.setTables(tables2);
		
		
		Table result = identifier.getTableAtPath(Arrays.asList(withoutMatch, withMatch), "match.match");
		
		assertThat(result == matchTable).isTrue();
	}
	
	
	@Test
	void getColumnAtPathWillFindTheCorrectTable()
	{
		Column matchColumn = new Column();
		matchColumn.setName("match");
		
		
		List<Column> columnsWithoutMatch = Arrays.asList(new Column(), new Column());
		columnsWithoutMatch.get(0).setName("noMatch");
		columnsWithoutMatch.get(1).setName("noMatch");
		
		List<Column> columnsWithMatch = Arrays.asList(matchColumn, new Column());
		columnsWithMatch.get(1).setName("noMatch");
		
		List<Table> tables1 = Arrays.asList(new Table(), new Table());
		tables1.get(0).setName("noMatch");
		tables1.get(0).setColumns(columnsWithoutMatch);
		tables1.get(1).setName("noMatch");
		tables1.get(1).setColumns(columnsWithoutMatch);
		
		List<Table> tables2 = Arrays.asList(new Table(), new Table());
		tables2.get(0).setName("match");
		tables2.get(0).setColumns(columnsWithMatch);
		tables2.get(1).setName("noMatch");
		tables2.get(1).setColumns(columnsWithoutMatch);
		
		
		
		Schema schemaWithoutMatch = new Schema();
		schemaWithoutMatch.setName("noMatch");
		schemaWithoutMatch.setTables(tables1);
		
		Schema schemaWithMatch = new Schema();
		schemaWithMatch.setName("match");
		schemaWithMatch.setTables(tables2);
		
		
		Column result = identifier.getColumnAtPath(Arrays.asList(schemaWithoutMatch, schemaWithMatch), "match.match.match");
		
		assertThat(result == matchColumn).isTrue();
	}

}
