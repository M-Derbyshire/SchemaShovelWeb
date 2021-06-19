import Queue from '../../Queue/Queue';

//Superclass for any JSON validators.
//Provides an error queue, and related methods for that.
//validateJSON() is the main method for subclasses
//There are helper methods here, for use while validating
export default class JSONValidator
{
	constructor()
	{
		this._errorQueue = new Queue();
		this._addError = this._errorQueue.enqueue.bind(this._errorQueue);
	}
	
	//Returns true/false, dependant on if there were validation errors
	//in the errorQueue
	hasErrors()
	{
		return !this._errorQueue.isEmpty();
	}
	
	//Returns (and dequeues) the next error in the errorQueue
	getNextError()
	{
		return this._errorQueue.dequeue();
	}
	
	//Overrides of this should return true if successful, or false if there were errors
	validateJSON(json)
	{
		return true;
	}
	
	
	
	//item could be a schema/table/column
	//item index is the index of the item in it's respective array
	//itemName could be "schema"/"table"/"column"/etc
	_validateSingleItem(item, itemIndex, itemName, validProperties)
	{
		validProperties.forEach((prop) => {
			const optional = (prop.hasOwnProperty("optional") && prop.optional);
			this._validateProperty(item, itemIndex, itemName, prop.name, prop.type, optional);
		});
	}
	
	//Type checking method
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
	
	//Validates a property that an object contains
	//itemName could be "schema"/"table"/"column"/etc
	//propType for arrays is just "array"
	//optional determines if the object doesn't have to have this property
	_validateProperty(item, itemIndex, itemName, propName, propType, optional = false)
	{
		const SentenceStartItemName = this._getWordWithCapitalisedFirstLetter(itemName);
		
		if(item.hasOwnProperty(propName) && item[propName])
		{
			if(!this._propertyIsOfType(item, propName, propType))
				this._addError(`${SentenceStartItemName}'s ${propName} property at index ${itemIndex} is not a valid ${propType}.`);
		}
		else if(!optional)
		{
			this._addError(`${SentenceStartItemName} at index ${itemIndex} does not have a ${propName} property.`);
		}
	}
	
	_getWordWithCapitalisedFirstLetter(word)
	{
		return word.charAt(0).toUpperCase() + word.slice(1);;
	}
}