import Queue from '../../Queue/Queue';

/** Superclass for any JSON validators. Provides an error queue (and related methods for that), and also 
helper methods for validation */
class JSONValidator
{
	
	/** Create a new JSONValidator instance */
	constructor()
	{
		this._errorQueue = new Queue();
		this._addError = this._errorQueue.enqueue.bind(this._errorQueue);
	}
	
	
	/**
	* Returns a boolean, which confirms if there are any validation errors in the error queue
	* @return {boolean} Does the queue currently contain errors?
	*/
	hasErrors()
	{
		return !this._errorQueue.isEmpty();
	}
	
	
	/**
	* Retrieve and remove the next error message from the error queue
	* @return The error message that was removed from the queue
	*/
	getNextError()
	{
		return this._errorQueue.dequeue();
	}
	
	
	/**
	* Overrides of this should return true if successful, or false if there were errors
	* @param {string} json - The JSON text to be validated
	* @return {bool} This implementation just returns true
	*/
	validateJSON(json)
	{
		return true;
	}
	
	
	/**
	* Validates a single item, based on the given array of valid properties
	* @param {Object} item - This can be a schema/table/column object
	* @param {number} itemIndex - The index of the item in it's respective array
	* @param {string} itemName - Can be "schema"/"table"/"column"
	* @param {Array} validProperties - An array of objects that define the valid properties for the item in 
	* question. Each of these objects will have a "name" and "type" property (see _propertyIsOfType() method), 
	* which are both strings. They can also have "optional" and "canBeEmptyString" properties, which are 
	* booleans
	*/
	_validateSingleItem(item, itemIndex, itemName, validProperties)
	{
		validProperties.forEach((prop) => {
			const optional = (prop.hasOwnProperty("optional") && prop.optional);
			this._validateProperty(item, itemIndex, itemName, prop.name, prop.type, optional, prop.canBeEmptyString);
		});
	}
	
	/**
	* Validates a single item, based on the given array of valid properties
	* @param {Object} item - This can be a schema/table/column object
	* @param {string} propName - The name of the property on the given item
	* @param {string} propType - A datatype string. E.g. "number"/"string"/"array"
	* @return {boolean} Is the property's value of the given type?
	*/
	_propertyIsOfType(item, propName, propType)
	{
		if(propType === "array")
		{
			return Array.isArray(item[propName]);
		}
		else
		{
			return (typeof item[propName] === propType);
		}
	}
	
	
	/**
	* Validates a property that an item object contains
	* @param {Object} item - This can be a schema/table/column object
	* @param {number} itemIndex - The index of the item in it's respective array
	* @param {string} itemName - Can be "schema"/"table"/"column"
	* @param {string} propName - The name of the property on the given item
	* @param {string} propType - A datatype string. E.g. "number"/"string"/"array"
	* @param {boolean} [optional=false] - Is this a required property?
	* @param {boolean} [canBeEmptyString=false] - If the property's value is a string, can it be empty?
	*/
	_validateProperty(item, itemIndex, itemName, propName, propType, optional = false, canBeEmptyString = false)
	{
		const SentenceStartItemName = this._getWordWithCapitalisedFirstLetter(itemName);
		
		if(item.hasOwnProperty(propName) && (item[propName] || (canBeEmptyString && (typeof item[propName] === "string" || item[propName] instanceof String))))
		{
			if(!this._propertyIsOfType(item, propName, propType))
				this._addError(`${SentenceStartItemName}'s ${propName} property at index ${itemIndex} is not a valid ${propType}.`);
		}
		else if(!canBeEmptyString && item[propName] === "")
		{
			this._addError(`${SentenceStartItemName} at index ${itemIndex} has an empty string as a ${propName} property.`);
		}
		else if(!optional)
		{
			this._addError(`${SentenceStartItemName} at index ${itemIndex} does not have a ${propName} property.`);
		}
	}
	
	
	/**
	* Takes a word in lowercase, and returns it with a capitalised first letter
	* @param {string} word - The original lowercase word
	* @return {string} The passed in word, but with a capitalised first letter
	*/
	_getWordWithCapitalisedFirstLetter(word)
	{
		return word.charAt(0).toUpperCase() + word.slice(1);;
	}
}

export default JSONValidator;