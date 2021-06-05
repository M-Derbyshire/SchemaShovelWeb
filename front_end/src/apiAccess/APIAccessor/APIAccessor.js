import Queue from '../Queue/Queue';

export default class APIAccessor
{
	constructor(baseURL)
	{
		this._baseURL = baseURL;
		
		this._errorQueue = new Queue();
		this._addError = this._errorQueue.enqueue.bind(this._errorQueue);
	}
	
	
	//Throws error
	async _getJSONFromAPI(path, settings = {})
	{
		const response = await fetch(path, settings);
		
		if(response.ok)
		{
			return await response.json();
		}
		else
		{
			throw new Error(response.statusText);
		}
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
			const dbList = await this._getJSONFromAPI(this._baseURL + "/databases/");
			
			if(Array.isArray(dbList)) return dbList;
			else throw new Error("Value from API was not a valid array.");
		}
		catch(err)
		{
			this._addError(`Issue while loading database list: ${err.message}`);
			return [];
		}
	}
	
	async getDatabaseByID(id)
	{
		try
		{
			const db = await this._getJSONFromAPI(this._baseURL + "/databases/" + id);
			
			if(!Array.isArray(db)) return db;
			else throw new Error("Value from API is an array, and is therefore not a valid database record.");
		}
		catch(err)
		{
			this._addError(`Issue while loading database record: ${err.message}`);
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
			
			const db = await this._getJSONFromAPI(this._baseURL + "/databases/" + id, settings);
			
			if(!Array.isArray(db)) return db;
			else throw new Error("Value from API is an array, and is therefore not a valid database record.");
		}
		catch(err)
		{
			this._addError(`Issue while updating database record: ${err.message}`);
			return {};
		}
	}
}