import Queue from '../Queue/Queue';
import DatabaseEntityAccessor from './EntityAccessors/DatabaseEntityAccessor';
import DescribableEntityAccessor from './EntityAccessors/DescribableEntityAccessor';

/** Provides a way to interface with the API */
class APIAccessor
{
	
	/** 
	* Create a new APIAccessor
	* @param {string} baseURL - The root URL of the API (e.g. "http://thisAPI.com/api/v1/")
	* @param {function} onErrorCallback - A function to call if there is an error
	*/
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
	
	
	/** 
	* The function that calls and retrieves data from the API (This may throw an exception)
	* @param {string} path - The API URL for the request
	* @param {Object} settings - The second argument passed to fetch()
	*
	* @return {string} The JSON text that was retrieved
	*/
	async _getJSONFromAPI(path, settings = {})
	{
		const response = await fetch(path, settings);
		
		if(!response.ok)
		{
			throw new Error(`(${response.status}) ${response.statusText}`);
		}
		
		return await response.text();
	}
	
	
	/**
	* Does this APIAccessor instance currently have any errors record?
	* @return {boolean} Are there any errors?
	*/
	hasErrors()
	{
		return !this._errorQueue.isEmpty();
	}
	
	/**
	* Get the next error message recorded in this instance of APIAccessor
	* @return {string} The next error message
	*/
	getNextError()
	{
		return this._errorQueue.dequeue();
	}
	
	/**
	* If this APIAccessor instance has any errors, this will call the onErrorCallback() method, and then
	* throw an exception.
	*/
	handleErrors()
	{
		if(this.hasErrors())
		{
			this._onErrorCallback();
			throw new Error("There was an error accessing the API. Use the getNextError() method for more details.");
		}
	}
	
	
	
	/**
	* Get the full database list from the API (or throw an exception). This delegates to a 
	* DatabaseEntityAccessor instance
	* @return {Array} The response database list
	*/
	async getDatabaseList()
	{
		const result = await this._databaseEntityAccessor.getDatabaseList();
		this.handleErrors();
		return result;
	}
	
	/**
	* Get a database from the API, with the passed ID (or throw an exception). This delegates to a 
	* DatabaseEntityAccessor instance
	* @param {number} id - The ID of the database record to retrieve in the [database] table
	* @return {Object} The response database object
	*/
	async getDatabaseByID(id)
	{
		const result = await this._databaseEntityAccessor.getDatabaseByID(id);
		this.handleErrors();
		return result;
	}
	
	/**
	* Add a database record to the app's database, through the API (or throw an exception). This delegates 
	* to a DatabaseEntityAccessor instance
	* @param {string} newDB - The database JSON to be passed to the API
	* @return {Object} The response database object
	*/
	async createDatabase(newDB)
	{
		const result = await this._databaseEntityAccessor.createDatabase(newDB);
		this.handleErrors();
		return result;
	}
	
	/**
	* Change the name of a database record in the app's database, through the API (or throw an exception). 
	* This delegates to a DatabaseEntityAccessor instance
	* @param {number} id - The id of the database record in the [database] table
	* @param {string} newName - The new name for the database record in the [database] table
	* @return {Object} The response database object
	*/
	async updateDatabaseName(id, newName)
	{
		const result = await this._databaseEntityAccessor.updateDatabaseName(id, newName);
		this.handleErrors();
		return result;
	}
	
	/**
	* Delete a database record in the app's database, through the API (or throw an exception). 
	* This delegates to a DatabaseEntityAccessor instance
	* @param {number} id - The id of the database record in the [database] table
	* @return {Boolean} True if the deletion was successful, or false if not (though actually an exception will 
	* be thrown if not)
	*/
	async deleteDatabase(id)
	{
		const result = await this._databaseEntityAccessor.deleteDatabase(id);
		this.handleErrors();
		return result;
	}
	
	
	/**
	* Change the description of a schema/table/column record in the app's database, through the API (or 
	* throw an exception). This delegates to a DescribableEntityAccessor instance
	* @param {string} entityRouteName - The name of the entity. Used like this: 
	* "http://thisAPI.com/api/v1/-entityRouteName-/-id-"
	* @param {number} id - The id of the entity record in the [schema], [table] or [column] table
	* @param {string} newDescription - The new description for the entity record
	* @return {Object} The response entity object
	*/
	async updateEntityDescription(entityRouteName, id, newDescription)
	{
		const result = 
			await this._describableEntityAccessor.updateEntityDescription(entityRouteName, id, newDescription);
		
		this.handleErrors();
		return result;
	}
}

export default APIAccessor;