import JSONValidator from '../JSONValidator/JSONValidator';

export default class SingleItemJSONValidator extends JSONValidator
{
	constructor(validProperties)
	{
		super();
		
		this._validProperties = validProperties;
	}
	
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