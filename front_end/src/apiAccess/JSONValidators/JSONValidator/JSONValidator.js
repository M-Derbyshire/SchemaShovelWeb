import Queue from '../../Queue/Queue';

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
	
	validateJSON(json)
	{
		return true;
	}
	
	
	
	//item could be a schema/table/column
	//item index is the index of the item in it's respective array
	//itemName could be "schema"/"table"/"column"
	_validateSingleItem(item, itemIndex, itemName, validProperties)
	{
		this._checkForInvalidProperties(validProperties, item, itemIndex, itemName);
		
		validProperties.forEach((prop) => {
			const optional = (prop.hasOwnProperty("optional") && prop.optional);
			this._validateProperty(item, itemIndex, itemName, prop.name, prop.type, optional);
		});
	}
	
	
	_checkForInvalidProperties(validProperties, item, itemIndex, itemName)
	{
		const SentenceStartItemName = this._getWordWithCapitalisedFirstLetter(itemName);
		
		//Using for..in would include prototype entries, so not using that
		for(const [key, value] of Object.entries(item))
		{
			if(validProperties.filter(vp => vp.name === key).length === 0)
				this._addError(`${SentenceStartItemName} at index ${itemIndex} contains an invalid property: ${key}.`);
		}
	}
	
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
	
	//propType for arrays is just "array"
	_validateProperty(item, itemIndex, itemName, propName, propType, optional = false)
	{
		const SentenceStartItemName = this._getWordWithCapitalisedFirstLetter(itemName);
		
		if(item.hasOwnProperty(propName))
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