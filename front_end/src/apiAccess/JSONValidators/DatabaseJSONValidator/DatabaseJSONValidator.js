import JSONValidator from '../JSONValidator/JSONValidator';
import SingleItemJSONValidator from '../SingleItemJSONValidator/SingleItemJSONValidator';

/**
* Used to validate JSON text representations of database schemas (and their inner-objects).
* This could be JSON provided by the user, or JSON from the API
* @extends JSONValidator
 */
class DatabaseJSONValidator extends JSONValidator
{
	
	/**
	* Creates a new DatabaseJSONValidator instance
	* @param {boolean} isJSONFromAPI - Is the JSON to be validated from the API, rather 
	* than from the user?
	*/
	constructor(isJSONFromAPI = true)
	{
		super();
		
		this.isJSONFromAPI = isJSONFromAPI;
		
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "schemas", type: "array" }
		];
		
		if(isJSONFromAPI) validProperties.push({ name: "id", type: "number" });
		
		this._singleItemValidator = new SingleItemJSONValidator(validProperties);
	}
	
	
	/**
	* Validates the given JSON text
	* @param {string} dbJSON - The JSON text to be validated
	* @return {boolean} Returns true if the JSON is valid, or false if not
	*/
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
	
	
	/**
	* The constructor creates an instance of SingleItemJSONValidator. This method will get any errors from 
	* that validator instance, and add it to the error queue of this validator
	*/
	_getErrorsFromSingleItemValidator()
	{
		while(this._singleItemValidator.hasErrors())
		{
			this._addError(this._singleItemValidator.getNextError());
		}
	}
	
	
	/**
	* Validates an array of schema objects (and their child entities)
	* @param {array} schemas - The array of schema objects to be validated
	*/
	_validateSchemaArray(schemas)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string", canBeEmptyString: true },
			{ name: "tables", type: "array" }
		];
		
		schemas.forEach((schema, index) => {
			
			this._validateSingleItem(schema, index, "schema", validProperties);
			
			if(Array.isArray(schema.tables)) this._validateTables(schema.tables);
			
		});
	}
	
	/**
	* Validates an array of table objects (and their child entities)
	* @param {array} tables - The array of table objects to be validated
	*/
	_validateTables(tables)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string", canBeEmptyString: true },
			{ name: "columns", type: "array" }
		];
		
		tables.forEach((table, index) => {
			
			this._validateSingleItem(table, index, "table", validProperties);
			
			if(Array.isArray(table.columns)) this._validateColumns(table.columns);
			
		});
	}
	
	/**
	* Validates an array of column objects
	* @param {array} columns - The array of column objects to be validated
	*/
	_validateColumns(columns)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string", canBeEmptyString: true }
		];
		
		if(this.isJSONFromAPI)
			validProperties.push({ name: "fkToTableId", type: "number", optional: true });
		else
			validProperties.push({ name: "fkToTableStr", type: "string", optional: true });
		
		
		const fkToTableRegex = /[^.]+\.[^.]+/;
		
		columns.forEach((column, index) => {
			
			this._validateSingleItem(column, index, "column", validProperties);
			
			if(!this.isJSONFromAPI && column.hasOwnProperty("fkToTableStr") && column.fkToTableStr 
				&& !fkToTableRegex.test(column.fkToTableStr))
			{
				this._addError(`Column at index ${index} has a misshapen fkToTable property value: ${column.fkToTableStr}`);
			}
		});
	}
}

export default DatabaseJSONValidator;