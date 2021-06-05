import JSONValidator from '../JSONValidator/JSONValidator';

export default class SingleItemJSONValidator extends JSONValidator
{
	constructor(validProperties)
	{
		super();
		
		this._validProperties = validProperties;
	}
	
	validateJSON(descJSON)
	{
		try
		{
			const descItem = JSON.parse(descJSON);
			
			if(Array.isArray(descItem))
			{
				this._addError(`The provided JSON should be a single object, not an array.`);
				return false;
			}
			
			this._validateSingleItem(descItem, 0, "Description JSON", this._validProperties);
		}
		catch(err)
		{
			this._addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
	}
}