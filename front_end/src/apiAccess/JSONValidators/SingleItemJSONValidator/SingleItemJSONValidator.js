import JSONValidator from '../JSONValidator/JSONValidator';

/**
* Used to validate JSON text for a single object, based on the given array of valid properties
* @extends JSONValidator
 */
class SingleItemJSONValidator extends JSONValidator
{
	/**
	* Creates a new DatabaseJSONValidator instance
	* @param {array} validProperties - An array of objects that define the valid properties for the item in 
	* question. Each of these objects will have a "name" and "type" property, 
	* which are both strings. They can also have "optional" and "canBeEmptyString" properties, which are 
	* booleans
	*/
	constructor(validProperties)
	{
		super();
		
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
			const item = JSON.parse(json);
			
			if(Array.isArray(item))
			{
				this._addError(`The provided JSON should be a single object, not an array.`);
				return false;
			}
			
			this._validateSingleItem(item, 0, "JSON", this._validProperties);
		}
		catch(err)
		{
			this._addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
	}
}

export default SingleItemJSONValidator;