import Queue from '../Queue/Queue';
import DatabaseEntityAccessor from './EntityAccessors/DatabaseEntityAccessor';
import DescribableEntityAccessor from './EntityAccessors/DescribableEntityAccessor';

export default class APIAccessor
{
	//baseURL is the root of the URL (e.g. "http://thisAPI.com/api/v1/")
	constructor(baseURL)
	{
		this._baseURL = baseURL;
		
		this._errorQueue = new Queue();
		this._addError = this._errorQueue.enqueue.bind(this._errorQueue);
		
		this._databaseEntityAccessor = new DatabaseEntityAccessor(
			this._baseURL, 
			this._getJSONFromAPI, 
			this._addError
		);
		
		this._describableEntityAccessor = new DescribableEntityAccessor(
			this._baseURL, 
			this._getJSONFromAPI, 
			this._addError
		);
	}
	
	
	//Throws error
	//path is the URL, settings is the second argument passed to fetch()
	//Returns an array to be destructured, containing the response text, and also the JSON
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
	
	
	
	//Will return the response array if successful, or an empty array if there was an error
	async getDatabaseList()
	{
		return await this._databaseEntityAccessor.getDatabaseList();
	}
	
	//Will return the response object if successful, or an empty object if there was an error
	async getDatabaseByID(id)
	{
		return await this._databaseEntityAccessor.getDatabaseByID(id);
	}
	
	//newDB is the JSON generated by the SQL scripts
	//Will return the response object if successful, or an empty object if there was an error
	async createDatabase(newDB)
	{
		return await this._databaseEntityAccessor.createDatabase(newDB);
	}
	
	//Will return the response object if successful, or an empty object if there was an error
	async updateDatabaseName(id, newName)
	{
		return await this._databaseEntityAccessor.updateDatabaseName(id, newName);
	}
	
	//Returns true if successful, or false if there was an error
	async deleteDatabase(id)
	{
		return await this._databaseEntityAccessor.deleteDatabase(id);
	}
	
	
	//entityRouteName is the name of the entity. Used like this:
	//"http://thisAPI.com/api/v1/<entityRouteName>/<id>"
	//Will return the response object if successful, or an empty object if there was an error
	async updateEntityDescription(entityRouteName, id, newDescription)
	{
		return await this._describableEntityAccessor.updateEntityDescription(entityRouteName, id, newDescription);
	}
}