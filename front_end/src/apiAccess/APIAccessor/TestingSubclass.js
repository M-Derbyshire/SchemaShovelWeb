import APIAccessor from '../APIAccessor/APIAccessor';

export default class TestingSubclass extends APIAccessor
{
	constructor(path, mockErrorCallback)
	{
		super(path, mockErrorCallback);
	}
	
	addTestError(errorText)
	{
		this._errorQueue.enqueue(errorText);
	}
	
	getSettingsObject()
	{
		return this._settings;
	}
}