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
		this._dbJSONValidator = new DatabaseJSONValidator();
		
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
			
			this._validateDatabaseJSON(`${dbText}`);
			
			return db;
		}
		catch(err)
		{
			this._addError(`Error while loading database record: ${err.message}`);
			return {};
		}
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
			
			this._validateDatabaseJSON(`${dbText}`);
			
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
	_validateDatabaseJSON(jsonText)
	{
		this._validateJSONWithValidator(jsonText, this._dbJSONValidator);
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