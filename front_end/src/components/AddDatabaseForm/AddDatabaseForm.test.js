import AddDatabaseForm from './AddDatabaseForm';
import ReactTestUtils from 'react-dom/test-utils';

const fakeFormOnSubmit = (name, json) => {};
const fakeOnErrorHandler = (name, json) => {};
const fakeOnCancelHandler = (name, json) => {};



test("AddDatabaseForm will run the onCancelHandler prop function when the cancel button is clicked", () => {
	
	const mockOnCancelHandler = jest.fn();
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={mockOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const cancelButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaCancel");
	ReactTestUtils.Simulate.click(cancelButton);
	
	expect(mockOnCancelHandler).toBeCalled();
});



test("AddDatabaseForm will run the onSubmitHandler prop function with the right data", () => {
	
	const mockOnSubmitHandler = jest.fn();
	const testName = "testName";
	const testJSON = "not-real-json";
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={mockOnSubmitHandler}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "textarea");
	ReactTestUtils.Simulate.change(textarea, { "target": { "value": testJSON }});
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaNameInput");
	ReactTestUtils.Simulate.change(nameInput, { "target": { "value": testName }});
	
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "form");
	ReactTestUtils.Simulate.submit(form);
	
	expect(mockOnSubmitHandler).toHaveBeenCalledWith(testName, testJSON);
});


test.each([
	[undefined],
	[false],
	[true]
])("AddDatabaseForm will disable its name input, and buttons, based on the disabled prop", (isDisabled) => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100}
		disabled={isDisabled} />);
	
	const nameInputDisabled = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaNameInput");
	const cancelDisabled = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaCancel");
	const textAreaDisabled = 
			ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "textarea");
	const submitDisabled = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaSubmit");
	
	
	if(!isDisabled) //includes undefined
	{
		expect(nameInputDisabled).not.toBeDisabled();
		expect(cancelDisabled).not.toBeDisabled();
		expect(textAreaDisabled).not.toBeDisabled();
	}
	else
	{
		expect(nameInputDisabled).toBeDisabled();
		expect(cancelDisabled).toBeDisabled();
		expect(textAreaDisabled).toBeDisabled();
	}
	
	
	//Submit will be disabled if the inputs are disabled, as per a test later in this file
	if(!isDisabled)
	{
		ReactTestUtils.Simulate.change(nameInputDisabled, { target: { value: "test" } });
		ReactTestUtils.Simulate.change(textAreaDisabled, { target: { value: "test" } });
		
		expect(submitDisabled).not.toBeDisabled();
	}
});



test("AddDatabaseForm will display loading test (and not a form) if isLoading prop is true", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		isLoading={true}
		dbNameCharLimit={100} />);
	
	const loadingTexts = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbForm, "infoText");
	const renderedForms = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbForm, "form");
	
	expect(loadingTexts.length).toBe(1);
	expect(renderedForms.length).toBe(0);
});


test("AddDatabaseForm will display and set (onChanges) the database name test", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaNameInput");
	
	expect(nameInput.value).toBe("");
	ReactTestUtils.Simulate.change(nameInput, { "target": { "value": "1" }});
	expect(nameInput.value).toBe("1");
});


test("AddDatabaseForm will display and set (onChanges) the database JSON test", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "textarea");
	
	expect(textarea.value).toBe("");
	ReactTestUtils.Simulate.change(textarea, { "target": { "value": "1" }});
	expect(textarea.value).toBe("1");
});

test.each([
	[true],
	[false],
	[undefined]
])("AddDatabaseForm will set the add database schema button's text to 'Saving...' if isSaving prop is true", (isSaving) => {
	
	const dbFormSaving = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100}
		isSaving={isSaving} />);
	
	const submitButtonSaving = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormSaving, "databaseSchemaSubmit");
	
	if(isSaving)
		expect(submitButtonSaving.value).toBe("Saving...");
	else
		expect(submitButtonSaving.value).not.toBe("Saving...");
});

test("AddDatabaseForm will disable it's submit button if inputfields are empty, then enable once both are populated", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaNameInput");
	const jsonInput = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "textarea");
	
	const submitButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaSubmit");
	
	expect(submitButton).toBeDisabled();
	
	ReactTestUtils.Simulate.change(nameInput, { target: { value: "test" } });
	
	expect(submitButton).toBeDisabled();
	
	ReactTestUtils.Simulate.change(jsonInput, { target: { value: "test" } });
	
	expect(submitButton).not.toBeDisabled();
});