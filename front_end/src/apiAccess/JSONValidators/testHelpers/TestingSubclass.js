import JSONValidator from '../JSONValidator/JSONValidator';

export default class TestingSubclass extends JSONValidator
{
	constructor()
	{
		super();
	}
	
	addTestError(errorText)
	{
		this._errorQueue.enqueue(errorText);
	}
}