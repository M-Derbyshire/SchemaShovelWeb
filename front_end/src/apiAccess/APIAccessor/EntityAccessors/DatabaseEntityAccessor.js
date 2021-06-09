import JSONArrayValidator from '../../JSONValidators/JSONArrayValidator/JSONArrayValidator';
import DatabaseJSONValidator from '../../JSONValidators/DatabaseJSONValidator/DatabaseJSONValidator';

export default class DatabaseEntityAccessor
{
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
	
	
	async getDatabaseList()
	{
		try
		{
			const [dbListText, dbList] = await this._getJSONFromAPI(this._baseURL + "/databases/");
			
			this._validateIDAndNameJSON(dbListText);
			
			return dbList;
		}
		catch(err)
		{
			this._addError(`Error while loading database list: ${err.message}`);
			return [];
		}
	}
	
	
	async getDatabaseByID(id)
	{
		try
		{
			const [dbText, db] = await this._getJSONFromAPI(this._baseURL + "/databases/" + id);
			
			this._validateDatabaseJSON(`${dbText}`, false);
			
			return db;
		}
		catch(err)
		{
			this._addError(`Error while loading database record: ${err.message}`);
			return {};
		}
	}
	
	async createDatabase(newDB)
	{
		let dbText, db;
		
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
			
			[dbText, db] = await this._getJSONFromAPI(this._baseURL + "/databases", settings);
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
		
		return db;
	}
	
	
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
			
			const [dbText, db] = await this._getJSONFromAPI(this._baseURL + "/databases/" + id, settings);
			
			this._validateDatabaseJSON(`${dbText}`, false);
			
			return db;
		}
		catch(err)
		{
			this._addError(`Error while updating database record: ${err.message}`);
			return {};
		}
	}
	
	
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
				throw new Error(response.statusText);
			}
		}
		catch(err)
		{
			this._addError(`Error while deleting database record: ${err.message}.`);
			return false;
		}
	}
	
	
	//Throws error
	_validateIDAndNameJSON(jsonText)
	{
		this._validateJSONWithValidator(jsonText, this._dbIDAndNameJSONValidator);
	}
	
	//Throws error
	_validateDatabaseJSON(jsonText, jsonIsFromUser)
	{
		const validator = (jsonIsFromUser) ? this._userDBJSONValidator : this._apiDBJSONValidator;
		this._validateJSONWithValidator(jsonText, validator);
	}
	
	//Throws error
	_validateJSONWithValidator(jsonText, validator)
	{
		if(!validator.validateJSON(jsonText))
		{
			throw new Error(validator.getNextError());
		}
	}
}