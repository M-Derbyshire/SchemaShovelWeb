import SingleItemJSONValidator from '../../JSONValidators/SingleItemJSONValidator/SingleItemJSONValidator';

export default class DescribableEntityAccessor
{
	constructor(baseURL, getJSONFromAPIFunc, addErrorFunc)
	{
		this._baseURL = baseURL;
		this._getJSONFromAPI = getJSONFromAPIFunc;
		this._addError = addErrorFunc;
		
		const validProperties = [{ name: "description", type: "string" }];
		
		this._validator = new SingleItemJSONValidator(validProperties);
	}
	
	//entityRouteName -> http://thisAPI.com/v1/<entityRouteName>/<id>
	async updateEntityDescription(entityRouteName, id, newDescription)
	{
		try
		{
			if(typeof newDescription !== "string") 
				throw new Error("The provided description was not a valid string.");
			
			if(typeof entityRouteName !== "string") 
				throw new Error("The provided entity name was not a valid string.");
			
			const settings = {
				method: "PATCH",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					description: newDescription
				})
			};
			
			const [recordText, record] = await this._getJSONFromAPI(`${this._baseURL}/${entityRouteName}/${id}`, settings);
			
			this._validateDescriptionJSON(recordText);
			
			return record;
		}
		catch(err)
		{
			this._addError(`Error while updating record: ${err.message}`);
			return {};
		}
	}
	
	
	_validateDescriptionJSON(jsonText)
	{
		if(!this._validator.validateJSON(jsonText))
		{
			throw new Error(this._validator.getNextError());
		}
	}
}