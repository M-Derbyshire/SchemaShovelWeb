import Queue from '../Queue/Queue';
import DatabaseEntityAccessor from './EntityAccessors/DatabaseEntityAccessor';
import DescribableEntityAccessor from './EntityAccessors/DescribableEntityAccessor';

export default class APIAccessor
{
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
		return await this._databaseEntityAccessor.getDatabaseList();
	}
	
	async getDatabaseByID(id)
	{
		return await this._databaseEntityAccessor.getDatabaseByID(id);
	}
	
	async createDatabase(newDB)
	{
		return await this._databaseEntityAccessor.createDatabase(newDB);
	}
	
	async updateDatabaseName(id, newName)
	{
		return await this._databaseEntityAccessor.updateDatabaseName(id, newName);
	}
	
	async deleteDatabase(id)
	{
		return await this._databaseEntityAccessor.deleteDatabase(id);
	}
	
	
	async updateEntityDescription(entityRouteName, id, newDescription)
	{
		return await this._describableEntityAccessor.updateEntityDescription(entityRouteName, id, newDescription);
	}
}