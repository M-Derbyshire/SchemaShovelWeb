import JSONValidator from '../JSONValidator/JSONValidator';

export default class DatabaseJSONValidator extends JSONValidator
{
	constructor()
	{
		super();
	}
	
	
	//Takes the JSON string that represents the array of schemas
	//Returns true if JSON is valid, or false if there were errors
	validateJSON(dbJSON)
	{
		try
		{
			const schemas = JSON.parse(dbJSON);
			this._validateSchemaArray(schemas);
		}
		catch(err)
		{
			this._addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
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