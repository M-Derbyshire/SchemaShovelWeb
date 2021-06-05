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
	async _getJSONFromAPI(path)
	{
		const response = await fetch(path);
		
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
	
	// async getDatabaseByID(id)
	// {
	// 	try
	// 	{
	// 		const db = await this._getJSONFromAPI(this._baseURL);
	// 	}
	// 	catch(err)
	// 	{
			
	// 	}
	// }
}