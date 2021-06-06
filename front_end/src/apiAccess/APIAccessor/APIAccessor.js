import Queue from '../Queue/Queue';
import JSONArrayValidator from '../JSONValidators/JSONArrayValidator/JSONArrayValidator';
import DatabaseJSONValidator from '../JSONValidators/DatabaseJSONValidator/DatabaseJSONValidator';

export default class APIAccessor
{
	constructor(baseURL)
	{
		this._baseURL = baseURL;
		
		const validProperties = [
			{ name: "id", type: "number" },
			{ name: "name", type: "string" }
		];		
		this._dbIDAndNameJSONValidator = new JSONArrayValidator("database", validProperties);
		this._userDBJSONValidator = new DatabaseJSONValidator(false);
		this._apiDBJSONValidator = new DatabaseJSONValidator(true);
		
		this._errorQueue = new Queue();
		this._addError = this._errorQueue.enqueue.bind(this._errorQueue);
	}
	
	
	//Throws error
	async _getJSONFromAPI(path, settings = {})
	{
		const response = await fetch(path, settings);
		
		if(!response.ok)
		{
			throw new Error(response.statusText);
		}
		
		const text = await response.text();
		const json = JSON.parse(text);
		
		return [text, json];
	}
	
	
	
	hasErrors()
	{
		return !this._errorQueue.isEmpty();
	}
	
	getNextError()
	{
		return this._errorQueue.dequeue();
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
		if(!validator.validateJSON(`${jsonText}`))
		{
			throw new Error(validator.getNextError());
		}
	}
}