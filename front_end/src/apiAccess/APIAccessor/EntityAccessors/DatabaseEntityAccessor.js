import JSONArrayValidator from '../../JSONValidators/JSONArrayValidator/JSONArrayValidator';
import DatabaseJSONValidator from '../../JSONValidators/DatabaseJSONValidator/DatabaseJSONValidator';

/** Provides a way to interface with the API, in relation to [database] records (and their child records) */
class DatabaseEntityAccessor
{
	/** 
	* Create a new DatabaseEntityAccessor
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
		
		const validProperties = [
			{ name: "id", type: "number" },
			{ name: "name", type: "string" }
		];
		
		this._dbIDAndNameJSONValidator = new JSONArrayValidator("database", validProperties);
		this._userDBJSONValidator = new DatabaseJSONValidator(false);
		this._apiDBJSONValidator = new DatabaseJSONValidator(true);
	}
	
	
	/**
	* Get the full database list from the API
	* @return {Array} The response database list, or an empty array if there was an error
	*/
	async getDatabaseList()
	{
		try
		{
			const dbListText = await this._getJSONFromAPI(this._baseURL + "/databases");
			
			this._validateIDAndNameJSON(dbListText);
			
			return JSON.parse(dbListText);
		}
		catch(err)
		{
			this._addError(`Error while loading database list: ${err.message}`);
			return [];
		}
	}
	
	
	/**
	* Get a database from the API, with the passed ID
	* @param {number} id - The ID of the database record to retrieve in the [database] table
	* @return {Object} The response database object, or an empty object if there was an error
	*/
	async getDatabaseByID(id)
	{
		try
		{
			const dbText = await this._getJSONFromAPI(this._baseURL + "/databases/" + id);
			
			this._validateDatabaseJSON(dbText, false);
			
			return JSON.parse(dbText);
		}
		catch(err)
		{
			this._addError(`Error while loading database record: ${err.message}`);
			return {};
		}
	}
	
	
	/**
	* Add a database record to the app's database, through the API
	* @param {string} newDB - The database JSON to be passed to the API
	* @return {Object} The response database object, or an empty object if there was an error
	*/
	async createDatabase(newDB)
	{
		let dbText;
		
		try
		{
			this._validateDatabaseJSON(newDB, true);
		}
		catch(preCreationError)
		{
			this._addError(`Error while creating database record: ${preCreationError.message}`);
			return {};
		}
		
		try
		{
			const settings = {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: newDB
			};
			
			dbText = await this._getJSONFromAPI(this._baseURL + "/databases", settings);
		}
		catch(duringCreationError)
		{
			this._addError(`Error during creation of database record: ${duringCreationError.message}`);
			return {};
		}
		
		try
		{
			this._validateDatabaseJSON(dbText, false);
		}
		catch(postCreationError)
		{
			this._addError(`Error after creation of database record: ${postCreationError.message}`);
			return {};
		}
		
		return JSON.parse(dbText);
	}
	
	
	/**
	* Change the name of a database record in the app's database, through the API
	* @param {number} id - The id of the database record in the [database] table
	* @param {string} newName - The new name for the database record in the [database] table
	* @return {Object} The response database object, or an empty object if there was an error
	*/
	async updateDatabaseName(id, newName)
	{
		try
		{
			if(typeof newName !== "string") throw new Error("The provided name was not a valid string");
			
			const settings = {
				method: "PATCH",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: newName
				})
			};
			
			const dbText = await this._getJSONFromAPI(this._baseURL + "/databases/" + id, settings);
			
			this._validateDatabaseJSON(dbText, false);
			
			return JSON.parse(dbText);
		}
		catch(err)
		{
			this._addError(`Error while updating database record: ${err.message}`);
			return {};
		}
	}
	
	//Returns true if successful, or false if there was an error
	/**
	* Delete a database record in the app's database, through the API
	* @param {number} id - The id of the database record in the [database] table
	* @return {Boolean} True if the deletion was successful, or false if there was an error
	*/
	async deleteDatabase(id)
	{
		try
		{
			const response = await fetch(`${this._baseURL}/databases/${id}`, {
				method: "DELETE"
			});
		
			if(response.ok)
			{
				return true
			}
			else
			{
				throw new Error(`(${response.status}) ${response.statusText}`);
			}
		}
		catch(err)
		{
			this._addError(`Error while deleting database record: ${err.message}.`);
			return false;
		}
	}
	
	
	/**
	* Validates the given JSON text with an instance of JSONArrayValidator (and throws an exception if it 
	* is invalid)
	* @param {string} jsonText - The JSON text to be validated
	*/
	_validateIDAndNameJSON(jsonText)
	{
		this._validateJSONWithValidator(jsonText, this._dbIDAndNameJSONValidator);
	}
	
	/**
	* Validates the given JSON text with an instance of DatabaseJSONValidator (and throws an exception if it 
	* is invalid)
	* @param {string} jsonText - The JSON text to be validated
	* @param {boolean} jsonIsFromUser - Was this JSON provided by the user, or by the API?
	*/
	_validateDatabaseJSON(jsonText, jsonIsFromUser)
	{
		const validator = (jsonIsFromUser) ? this._userDBJSONValidator : this._apiDBJSONValidator;
		this._validateJSONWithValidator(jsonText, validator);
	}
	
	/**
	* Validates the given JSON text with the given validator (and throws an exception if it is invalid)
	* @param {string} jsonText - The JSON text to be validated
	* @param {JSONValidator} validator - An instance of a subclass of JSONValidator
	*/
	_validateJSONWithValidator(jsonText, validator)
	{
		if(!validator.validateJSON(jsonText))
		{
			const firstError = validator.getNextError();
			
			while(validator.hasErrors()) validator.getNextError();
			
			throw new Error(firstError);
		}
	}
}

export default DatabaseEntityAccessor;