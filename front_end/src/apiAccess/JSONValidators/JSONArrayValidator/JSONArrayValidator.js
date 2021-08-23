import JSONValidator from '../JSONValidator/JSONValidator'; 

/** 
* Used to validate a JSON text representation of an array of objects, based on the given validProperties 
* @extends JSONValidator
*/
class JSONArrayValidator extends JSONValidator
{
	/**
	* Create a new JSONArrayValidator instance
	* @param {string} itemTypeName - the name of the type of entity being validated, such as 
	* schema/table/column (used in error messages)
	* @param {array} validProperties - An array of objects that define the valid properties for the item in 
	* question. Each of these objects will have a "name" and "type" property, 
	* which are both strings. They can also have "optional" and "canBeEmptyString" properties, which are 
	* booleans
	*/
	constructor(itemTypeName, validProperties)
	{
		super();
		
		this._itemTypeName = itemTypeName;
		this._validProperties = validProperties;
	}
	
	
	/**
	* Validates the given JSON text
	* @param {string} json - The JSON text to be validated
	* @return {boolean} Returns true if the JSON is valid, or false if not
	*/
	validateJSON(json)
	{
		try
		{
			const items = JSON.parse(json);
			
			if(!Array.isArray(items))
			{
				this._addError(`The provided JSON is not a valid array.`);
				return false;
			}
			
			items.forEach((item, index) => {
				this._validateSingleItem(item, index, this._itemTypeName, this._validProperties);
			});
		}
		catch(err)
		{
			this._addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
	}
}

export default JSONArrayValidator;