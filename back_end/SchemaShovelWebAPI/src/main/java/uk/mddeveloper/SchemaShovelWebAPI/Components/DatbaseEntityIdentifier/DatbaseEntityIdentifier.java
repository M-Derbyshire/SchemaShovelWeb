package uk.mddeveloper.SchemaShovelWebAPI.Components.DatbaseEntityIdentifier;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import uk.mddeveloper.SchemaShovelWebAPI.ExceptionHandling.UnprocessableEntityException;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Column;
import uk.mddeveloper.SchemaShovelWebAPI.Models.INameable;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Schema;
import uk.mddeveloper.SchemaShovelWebAPI.Models.Table;

@Component
public class DatbaseEntityIdentifier {
	
	private Pattern tablePattern;
	private Pattern columnPattern;
	
	public DatbaseEntityIdentifier()
	{
		tablePattern = Pattern.compile("[^.]+\\.[^.]+");
		columnPattern = Pattern.compile("[^.]+\\.[^.]+\\.[^.]+");
	}
	
	public boolean isValidTablePath(String stringToTest)
	{
		return isValidPathForGivenPattern(stringToTest, tablePattern);
	}
	
	public boolean isValidColumnPath(String stringToTest)
	{
		return isValidPathForGivenPattern(stringToTest, columnPattern);
	}
	
	private boolean isValidPathForGivenPattern(String stringToTest, Pattern pattern)
	{
		Matcher matcher = pattern.matcher(stringToTest);
		return matcher.find();
	}
	
	
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
	
	
	
	public Column getColumnAtPath(List<Schema> schemas, String path) throws UnprocessableEntityException
	{
		if(!isValidColumnPath(path))
			throw new UnprocessableEntityException("The given path to a column (" + path + ") is not valid");
		
		String[] pathEntities = path.split(".");
		
		
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
