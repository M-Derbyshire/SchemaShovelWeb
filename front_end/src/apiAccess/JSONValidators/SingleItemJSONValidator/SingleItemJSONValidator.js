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
			const descArray = JSON.parse(descJSON);
			
			if(!Array.isArray(descArray))
			{
				this._addError(`The provided JSON should be an array.`);
				return false;
			}
			
			const hasArraySizeErrors = !this._validateArraySize(descArray);
			
			if(!hasArraySizeErrors)
			{
				this._validateSingleItem(descArray[0], 0, "Description JSON", this._validProperties);
			}
		}
		catch(err)
		{
			this._addError(`Unable to parse provided JSON. Failed with error: "${err.message}"`);
		}
		
		return !this.hasErrors();
	}
	
	//Returns true if no issues, and false if errors were raised
	_validateArraySize(arr)
	{
		if(arr.length > 1)
		{
			this._addError(`The provided JSON should only contain one item.`);
		}
		else if(arr.length === 0)
		{
			this._addError(`The provided JSON is empty.`);
		}
		else
		{
			return true;
		}
		
		return false;
	}
}