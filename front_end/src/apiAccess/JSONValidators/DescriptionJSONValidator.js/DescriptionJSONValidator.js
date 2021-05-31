import JSONValidator from '../JSONValidator/JSONValidator';

export default class DescriptionJSONValidator extends JSONValidator
{
	constructor()
	{
		super();
	}
	
	validateJSON(descJSON)
	{
		const validProperties = [
			{ name: "description", type: "string" }
		];
		
		try
		{
			const descArray = JSON.parse(descJSON);
			const hasArraySizeErrors = !this._validateArraySize(descArray);
			
			if(!hasArraySizeErrors)
			{
				this._validateSingleItem(descArray[0], 0, "Description JSON", validProperties);
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
		if(!Array.isArray(arr))
		{
			this._addError(`The provided JSON should be an array.`);
		}
		else if(arr.length > 1)
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