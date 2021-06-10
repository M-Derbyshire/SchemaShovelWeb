import JSONValidator from '../JSONValidator/JSONValidator';
import SingleItemJSONValidator from '../SingleItemJSONValidator/SingleItemJSONValidator';

//Used to validate an object (and its inner held objects) representation
//of a database schema.
export default class DatabaseJSONValidator extends JSONValidator
{
	//Should the validator make sure the database record has an ID property?
	constructor(shouldHaveIDProperty = true)
	{
		super();
		
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "schemas", type: "array" }
		];
		
		if(shouldHaveIDProperty) validProperties.push({ name: "id", type: "number" });
		
		this._singleItemValidator = new SingleItemJSONValidator(validProperties);
	}
	
	
	//Takes the JSON string that represents the database schema.
	//Returns true if JSON is valid, or false if there were errors.
	validateJSON(dbJSON)
	{
		try
		{
			this._singleItemValidator.validateJSON(dbJSON);
			this._getErrorsFromSingleItemValidator();
			
			const db = JSON.parse(dbJSON);
			
			if(db.schemas && Array.isArray(db.schemas))	this._validateSchemaArray(db.schemas);
		}
		catch(err)
		{
			this._addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
	}
	
	
	_getErrorsFromSingleItemValidator()
	{
		while(this._singleItemValidator.hasErrors())
		{
			this._addError(this._singleItemValidator.getNextError());
		}
	}	
	
	
	_validateSchemaArray(schemas)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string" },
			{ name: "tables", type: "array" }
		];
		
		schemas.forEach((schema, index) => {
			
			this._validateSingleItem(schema, index, "schema", validProperties);
			
			if(Array.isArray(schema.tables)) this._validateTables(schema.tables);
			
		});
	}
	
	
	_validateTables(tables)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string" },
			{ name: "columns", type: "array" }
		];
		
		tables.forEach((table, index) => {
			
			this._validateSingleItem(table, index, "table", validProperties);
			
			if(Array.isArray(table.columns)) this._validateColumns(table.columns);
			
		});
	}
	
	
	_validateColumns(columns)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string" },
			{ name: "fkToTable", type: "string", optional: true }
		];
		
		const fkToTableRegex = /[^\.]+\.[^\.]+/;
		
		columns.forEach((column, index) => {
			
			this._validateSingleItem(column, index, "column", validProperties);
			
			if(column.hasOwnProperty("fkToTable") && !fkToTableRegex.test(column.fkToTable))
			{
				this._addError(`Column at index ${index} has a misshapen fkToTable property value: ${column.fkToTable}`);
			}
		});
	}
}