export default function(validator, errorCount, shouldLogErrors = false)
{
	for(let i = 0; i < errorCount; i++)
	{
		expect(validator.hasErrors()).toBeTruthy();
		const error = validator.getNextError();
		if(shouldLogErrors) console.log(error);
	}
	
	expect(validator.hasErrors()).toBeFalsy();
}