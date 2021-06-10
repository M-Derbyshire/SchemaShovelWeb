import JSONValidator from '../JSONValidator/JSONValidator';

//Used to validate a single object, based on the given array of valid properties
export default class SingleItemJSONValidator extends JSONValidator
{
	//validProperties will be an array of objects. Each object will have a "name" and 
	//"type" property
	constructor(validProperties)
	{
		super();
		
		this._validProperties = validProperties;
	}
	
	//Takes the textual representation of the item, and validates it.
	//As per the superclass, this returns true if there were no errors,
	//or false if errors were raised
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