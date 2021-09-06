package uk.mddeveloper.SchemaShovelWebAPI.Components.DatabaseEntityIdentifier;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.INameable;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

/**
 * This can be used to find tables or columns (by providing a path string) within a given List of schemas.
 * The path strings (e.g. "mySchema.myTable.myColumn") can be validated with the isValidTablePath and 
 * isValidColumnPath methods
 * 
 * @author Matthew Derbyshire
 */
@Component
public class DatabaseEntityIdentifier {
	
	/**
	 * A regex pattern for table path strings
	 */
	private Pattern tablePattern;
	
	/**
	 * A regex pattern for column path strings
	 */
	private Pattern columnPattern;
	
	/**
	 * Constructor
	 */
	public DatabaseEntityIdentifier()
	{
		tablePattern = Pattern.compile("[^.]+\\.[^.]+");
		columnPattern = Pattern.compile("[^.]+\\.[^.]+\\.[^.]+");
	}
	
	/**
	 * Confirms if the given string is a valid table path (e.g. "mySchema.myTable")
	 * @param stringToTest This is the string that you want to confirm is a valid table path
	 * @return True if the given string is a valid table path, and false if not
	 */
	public boolean isValidTablePath(String stringToTest)
	{
		return isValidPathForGivenPattern(stringToTest, tablePattern);
	}
	
	/**
	 * Confirms if the given string is a valid column path (e.g. "mySchema.myTable.myColumn")
	 * @param stringToTest This is the string that you want to confirm is a valid column path
	 * @return True if the given string is a valid column path, and false if not
	 */
	public boolean isValidColumnPath(String stringToTest)
	{
		return isValidPathForGivenPattern(stringToTest, columnPattern);
	}
	
	
	/**
	 * Confirms if the given string matches the given Pattern instance
	 * @param stringToTest This is the string that you want to confirm is a valid table/column path
	 * @param pattern this is the Pattern instance that holds the regex to test the string against
	 * @return True if the given string matches the given pattern, and false if not
	 */
	private boolean isValidPathForGivenPattern(String stringToTest, Pattern pattern)
	{
		Matcher matcher = pattern.matcher(stringToTest);
		return matcher.matches();
	}
	
	
	/**
	 * Searches through a given List of schemas for a particular table
	 * @param schemas The List of Schema objects, to be searched through
	 * @param path The table path for the table to be found (e.g. "mySchema.myTable")
	 * @return The Table instance that matches the given path string
	 * @throws UnprocessableEntityException Thrown if the given path is invalid, or if the schema/table isn't found
	 */
	public Table getTableAtPath(List<Schema> schemas, String path) throws UnprocessableEntityException
	{
		if(!isValidTablePath(path))
			throw new UnprocessableEntityException("The given path to a table (" + path + ") is not valid");
		
		String[] pathEntities = path.split("\\.");
		
		Schema matchingSchema = (Schema) getFirstEntityWithMatchingNameOrNull(schemas, pathEntities[0]);
		
		if(matchingSchema == null)
			throw new UnprocessableEntityException("The given schema (" + pathEntities[0] + ") in a path to a table (" + path + ") does not exist");
		
		
		Table matchingTable = (Table) getFirstEntityWithMatchingNameOrNull(
				matchingSchema.getTables(), 
				pathEntities[1]);
		
		if(matchingTable == null)
			throw new UnprocessableEntityException("The given table (" + pathEntities[1] + ") in a path to a table (" + path + ") does not exist");
		
		
		return matchingTable;
	}
	
	
	/**
	 * Searches through a given List of schemas for a particular column
	 * @param schemas The List of Schema objects, to be searched through
	 * @param path The column path for the column to be found (e.g. "mySchema.myTable.myColumn")
	 * @return The Column instance that matches the given path string
	 * @throws UnprocessableEntityException Thrown if the given path is invalid, or if the schema/table/column isn't found
	 */
	public Column getColumnAtPath(List<Schema> schemas, String path) throws UnprocessableEntityException
	{
		if(!isValidColumnPath(path))
			throw new UnprocessableEntityException("The given path to a column (" + path + ") is not valid");
		
		String[] pathEntities = path.split("\\.");
		
		
		Schema matchingSchema = (Schema) getFirstEntityWithMatchingNameOrNull(schemas, pathEntities[0]);
		
		if(matchingSchema == null)
			throw new UnprocessableEntityException("The given schema (" + pathEntities[0] + ") in a path to a column (" + path + ") does not exist");
		
		
		Table matchingTable = (Table) getFirstEntityWithMatchingNameOrNull(
				matchingSchema.getTables(), 
				pathEntities[1]);
		
		if(matchingTable == null)
			throw new UnprocessableEntityException("The given table (" + pathEntities[1] + ") in a path to a column (" + path + ") does not exist");
		
		
		Column matchingColumn = (Column) getFirstEntityWithMatchingNameOrNull(
				matchingTable.getColumns(), 
				pathEntities[2]);
		
		if(matchingColumn == null)
			throw new UnprocessableEntityException("The given column (" + pathEntities[2] + ") in a path to a column (" + path + ") does not exist");
		
		return matchingColumn;
	}
	
	
	/**
	 * Gets the first INameable entity in the given list that has the given name (or null if none found)
	 * @param entities A list of INameable entities, to be searched through
	 * @param name The name of the entity that is being searched for
	 * @return The first INameable entity, if it is found. If not, then returns null
	 */
	private INameable getFirstEntityWithMatchingNameOrNull(List<? extends INameable> entities, String name)
	{
		for(INameable entity : entities)
		{
			if(entity.getName().equals(name))
				return entity;
		}
		
		return null;
	}
	
}
