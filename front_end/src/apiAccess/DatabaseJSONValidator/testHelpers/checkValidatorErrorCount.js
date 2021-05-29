export default function(validator, errorCount)
{
	for(let i = 0; i < errorCount; i++)
	{
		expect(validator.hasErrors()).toBeTruthy();
		validator.getNextError();
	}
	
	expect(validator.hasErrors()).toBeFalsy();
}