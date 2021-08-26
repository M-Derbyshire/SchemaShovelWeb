import SingleItemJSONValidator from '../../JSONValidators/SingleItemJSONValidator/SingleItemJSONValidator';

/** Provides a way to interface with the API, in relation to entities that have descriptions */
class DescribableEntityAccessor
{
	
	/** 
	* Create a new DescribableEntityAccessor 
	* @param {string} baseURL - The root URL of the API (e.g. "http://thisAPI.com/api/v1/")
	* @param {function} getJSONFromAPIFunc - A function that will take a path string, and a settings object 
	* (2nd argument to fetch()), and then get the data from the API
	* @param {function} addErrorFunc - A function that should be passed the text for any errors that 
	* need raising
	*/
	constructor(baseURL, getJSONFromAPIFunc, addErrorFunc)
	{
		this._baseURL = baseURL;
		this._getJSONFromAPI = getJSONFromAPIFunc;
		this._addError = addErrorFunc;
		
		const validProperties = [{ name: "description", type: "string", canBeEmptyString: true }];
		
		this._validator = new SingleItemJSONValidator(validProperties);
	}
	
	
	/**
	* Change the description of a schema/table/column record in the app's database, through the API (or 
	* add an error with the addErrorFunc that was passed to the constructor)
	* @param {string} entityRouteName - The name of the entity. Used like this: 
	* "http://thisAPI.com/api/v1/-entityRouteName-/-id-"
	* @param {number} id - The id of the entity record in the [schema], [table] or [column] table
	* @param {string} newDescription - The new description for the entity record
	* @return {Object} The response entity object, or an empty object if there was an error
	*/
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
	/** 
	* Validate the given JSON text, using a SingleItemJSONValidator instance (and throw an exception if 
	* invalid)
	* @param {string} jsonText - The JSON text to be validated
	*/
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

export default DescribableEntityAccessor;