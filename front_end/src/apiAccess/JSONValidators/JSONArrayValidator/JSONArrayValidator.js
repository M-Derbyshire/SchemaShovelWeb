import JSONValidator from '../JSONValidator/JSONValidator'; 

export default class JSONArrayValidator extends JSONValidator
{
	constructor(itemTypeName, validProperties)
	{
		super();
		
		this._itemTypeName = itemTypeName;
		this._validProperties = validProperties;
	}
	
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