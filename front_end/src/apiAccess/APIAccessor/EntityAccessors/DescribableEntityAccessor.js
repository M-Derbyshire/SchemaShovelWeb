import SingleItemJSONValidator from '../../JSONValidators/SingleItemJSONValidator/SingleItemJSONValidator';

export default class DescribableEntityAccessor
{
	//baseURL is the root of the URL (e.g. "http://thisAPI.com/api/v1/")
	//getJSONFromAPIFunc is a function that returns an array to be destructured, 
	//	containing the response text, and also the JSON.
	//	It will take 2 parameters:
	//		path: the URL
	//		settings: to be passed to fetch(), as the second argument
	//addErrorFunc is a function, that should be passed the text for any errors that need raising.
	constructor(baseURL, getJSONFromAPIFunc, addErrorFunc)
	{
		this._baseURL = baseURL;
		this._getJSONFromAPI = getJSONFromAPIFunc;
		this._addError = addErrorFunc;
		
		const validProperties = [{ name: "description", type: "string" }];
		
		this._validator = new SingleItemJSONValidator(validProperties);
	}
	
	//entityRouteName is used like this: http://thisAPI.com/v1/<entityRouteName>/<id>
	//Will return the response object if successful, or an empty object if there was an error
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
			
			const [recordText, record] = await this._getJSONFromAPI(
				`${this._baseURL}/${entityRouteName}/update_description/${id}`, 
				settings
			);
			
			this._validateDescriptionJSON(recordText);
			
			return record;
		}
		catch(err)
		{
			this._addError(`Error while updating record: ${err.message}`);
			return {};
		}
	}
	
	//Throws error
	_validateDescriptionJSON(jsonText)
	{
		if(!this._validator.validateJSON(jsonText))
		{
			const firstError = this._validator.getNextError();
			
			while(this._validator.hasErrors()) this._validator.getNextError();
			
			throw new Error(firstError);
		}
	}
}