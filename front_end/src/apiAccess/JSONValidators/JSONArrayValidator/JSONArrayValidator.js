import JSONValidator from '../JSONValidator/JSONValidator'; 

export default class JSONArrayValidator extends JSONValidator
{
	//itemTypeName is the name of the type of entity being validated (used in error messages)
	//validProperties will be an array of objects. Each object will have a "name" and 
	//	"type" property
	constructor(itemTypeName, validProperties)
	{
		super();
		
		this._itemTypeName = itemTypeName;
		this._validProperties = validProperties;
	}
	
	//Takes the textual representation of the array of objects, and validates it.
	//As per the superclass, this returns true if there were no errors,
	//or false if errors were raised
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