import Queue from '../../Queue/Queue';

export default class JSONValidator
{
	constructor()
	{
		this._errorQueue = new Queue();
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
	
	validateJSON()
	{
		return true;
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
}