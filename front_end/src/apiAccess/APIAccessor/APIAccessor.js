import Queue from '../Queue/Queue';
import DatabaseEntityAccessor from './EntityAccessors/DatabaseEntityAccessor';
import DescribableEntityAccessor from './EntityAccessors/DescribableEntityAccessor';

export default class APIAccessor
{
	//baseURL is the root of the URL (e.g. "http://thisAPI.com/api/v1/")
	//onErrorCallback is a function to call if there is an error
	constructor(baseURL, onErrorCallback)
	{
		this._baseURL = baseURL;
		this._onErrorCallback = onErrorCallback;
		
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
	
	handleErrors()
	{
		if(this.hasErrors())
		{
			this._onErrorCallback();
			throw new Error("There was an error accessing the API. Use the getNextError() method for more details.");
		}
	}
	
	
	
	//Will return the response array if successful, or an empty array if there was an error
	async getDatabaseList()
	{
		const result = await this._databaseEntityAccessor.getDatabaseList();
		this.handleErrors();
		return result;
	}
	
	//Will return the response object if successful, or an empty object if there was an error
	async getDatabaseByID(id)
	{
		const result = await this._databaseEntityAccessor.getDatabaseByID(id);
		this.handleErrors();
		return result;
	}
	
	//newDB is a JSON string, representing a single object. Within the object there is a name property,
	//and a schemas array property (which is the output from the SQL script)
	//Will return the response object if successful, or an empty object if there was an error
	async createDatabase(newDB)
	{
		const result = await this._databaseEntityAccessor.createDatabase(newDB);
		this.handleErrors();
		return result;
	}
	
	//Will return the response object if successful, or an empty object if there was an error
	async updateDatabaseName(id, newName)
	{
		const result = await this._databaseEntityAccessor.updateDatabaseName(id, newName);
		this.handleErrors();
		return result;
	}
	
	//Returns true if successful, or false if there was an error
	async deleteDatabase(id)
	{
		const result = await this._databaseEntityAccessor.deleteDatabase(id);
		this.handleErrors();
		return result;
	}
	
	
	//entityRouteName is the name of the entity. Used like this:
	//"http://thisAPI.com/api/v1/<entityRouteName>/<id>"
	//Will return the response object if successful, or an empty object if there was an error
	async updateEntityDescription(entityRouteName, id, newDescription)
	{
		const result = 
			await this._describableEntityAccessor.updateEntityDescription(entityRouteName, id, newDescription);
		
		this.handleErrors();
		return result;
	}
}