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
		const addError = this._errorQueue.enqueue.bind(this._errorQueue);
		
		try
		{
			const schemas = JSON.parse(dbJSON);
			this._validateSchemaArray(schemas, addError);
		}
		catch(err)
		{
			addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
	}
	
	
	
	
	
	_validateSchemaArray(schemas, addError)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string" },
			{ name: "tables", type: "array" }
		];
		
		schemas.forEach((schema, index) => {
			
			this._validateSingleItem(schema, index, "schema", validProperties, addError);
			
			if(Array.isArray(schema.tables)) this._validateTables(schema.tables, addError);
			
		});
	}
	
	
	_validateTables(tables, addError)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string" },
			{ name: "columns", type: "array" }
		];
		
		tables.forEach((table, index) => {
			
			this._validateSingleItem(table, index, "table", validProperties, addError);
			
			if(Array.isArray(table.columns)) this._validateColumns(table.columns, addError);
			
		});
	}
	
	
	_validateColumns(columns, addError)
	{
		const validProperties = [
			{ name: "name", type: "string" },
			{ name: "description", type: "string" },
			{ name: "fkToTable", type: "string", optional: true }
		];
		
		const fkToTableRegex = /[^\.]+\.[^\.]+/;
		
		columns.forEach((column, index) => {
			
			this._validateSingleItem(column, index, "column", validProperties, addError);
			
			if(column.hasOwnProperty("fkToTable") && !fkToTableRegex.test(column.fkToTable))
			{
				addError(`Column at index ${index} has a misshapen fkToTable property value: ${column.fkToTable}`);
			}
		});
	}
	
	
	
	//item could be a schema/table/column
	//item index is the index of the item in it's respective array
	//itemName could be "schema"/"table"/"column"
	_validateSingleItem(item, itemIndex, itemName, validProperties, addError)
	{
		this._checkForInvalidProperties(validProperties, item, itemIndex, itemName, addError);
		
		validProperties.forEach((prop) => {
			const optional = (prop.hasOwnProperty("optional") && prop.optional);
			this._validateProperty(item, itemIndex, itemName, prop.name, prop.type, addError, optional);
		});
	}
	
	
	_checkForInvalidProperties(validProperties, item, itemIndex, itemName, addError)
	{
		const SentenceStartItemName = this._getWordWithCapitalisedFirstLetter(itemName);
		
		//Using for..in would include prototype entries, so not using that
		for(const [key, value] of Object.entries(item))
		{
			if(validProperties.filter(vp => vp.name === key).length === 0)
				addError(`${SentenceStartItemName} at index ${itemIndex} contains an invalid property: ${key}.`);
		}
	}
	
	
	//propType for arrays is just "array"
	_validateProperty(item, itemIndex, itemName, propName, propType, addError, optional = false)
	{
		const SentenceStartItemName = this._getWordWithCapitalisedFirstLetter(itemName);
		
		if(item.hasOwnProperty(propName))
		{
			if(!this._propertyIsOfType(item, propName, propType))
				addError(`${SentenceStartItemName}'s ${propName} property at index ${itemIndex} is not a valid ${propType}.`);
		}
		else if(!optional)
		{
			addError(`${SentenceStartItemName} at index ${itemIndex} does not have a ${propName} property.`);
		}
	}
	
	
	_getWordWithCapitalisedFirstLetter(word)
	{
		return word.charAt(0).toUpperCase() + word.slice(1);;
	}
}