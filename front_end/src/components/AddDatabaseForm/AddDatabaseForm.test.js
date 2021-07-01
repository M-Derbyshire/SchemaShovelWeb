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
		onCancelHandler={mockOnCancelHandler} />);
	
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
		onCancelHandler={fakeOnCancelHandler} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "textarea");
	ReactTestUtils.Simulate.change(textarea, { "target": { "value": testJSON }});
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaNameInput");
	ReactTestUtils.Simulate.change(nameInput, { "target": { "value": testName }});
	
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "form");
	ReactTestUtils.Simulate.submit(form);
	
	expect(mockOnSubmitHandler).toHaveBeenCalledWith(testName, testJSON);
});


test("AddDatabaseForm fill disable its name input, and buttons, based on the disabled prop", () => {
	
	const dbFormDisabledUndefined = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler} />);
	
	const dbFormDisabledFalse = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		disabled={false} />);
	
	const dbFormDisabledTrue = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		disabled={true} />);
	
	const nameInputDisabledUndefined = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledUndefined, "databaseSchemaNameInput");
	const nameInputDisabledFalse = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledFalse, "databaseSchemaNameInput");
	const nameInputDisabledTrue = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledTrue, "databaseSchemaNameInput");
	expect(nameInputDisabledUndefined).not.toBeDisabled();
	expect(nameInputDisabledFalse).not.toBeDisabled();
	expect(nameInputDisabledTrue).toBeDisabled();
	
	const submitDisabledUndefined = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledUndefined, "databaseSchemaSubmit");
	const submitDisabledFalse = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledFalse, "databaseSchemaSubmit");
	const submitDisabledTrue = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledTrue, "databaseSchemaSubmit");
	expect(submitDisabledUndefined).not.toBeDisabled();
	expect(submitDisabledFalse).not.toBeDisabled();
	expect(submitDisabledTrue).toBeDisabled();
	
	const cancelDisabledUndefined = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledUndefined, "databaseSchemaCancel");
	const cancelDisabledFalse = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledFalse, "databaseSchemaCancel");
	const cancelDisabledTrue = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbFormDisabledTrue, "databaseSchemaCancel");
	expect(cancelDisabledUndefined).not.toBeDisabled();
	expect(cancelDisabledFalse).not.toBeDisabled();
	expect(cancelDisabledTrue).toBeDisabled();
});



test("AddDatabaseForm will display loading test (and not a form) if isLoading prop is true", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		isLoading={true} />);
	
	const loadingTexts = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbForm, "infoText");
	const renderedForms = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbForm, "form");
	
	expect(loadingTexts.length).toBe(1);
	expect(renderedForms.length).toBe(0);
});


test("AddDatabaseForm will display and set (onChanges) the database name test", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler} />);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "databaseSchemaNameInput");
	
	expect(nameInput.value).toBe("");
	ReactTestUtils.Simulate.change(nameInput, { "target": { "value": "1" }});
	expect(nameInput.value).toBe("1");
});


test("AddDatabaseForm will display and set (onChanges) the database JSON test", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(dbForm, "textarea");
	
	expect(textarea.value).toBe("");
	ReactTestUtils.Simulate.change(textarea, { "target": { "value": "1" }});
	expect(textarea.value).toBe("1");
});

test("AddDatabaseForm will set the add database schema button's text to 'Saving...' if isSaving prop is true", () => {
	
	const dbFormSavingTrue = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		isSaving={true} />);
	
	const dbFormSavingFalse = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		isSaving={false} />);
	
	const dbFormSavingUndefined = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler} />);
	
	const submitButtonSavingTrue = ReactTestUtils.findRenderedDOMComponentWithClass(dbFormSavingTrue, "databaseSchemaSubmit");
	const submitButtonSavingFalse = ReactTestUtils.findRenderedDOMComponentWithClass(dbFormSavingFalse, "databaseSchemaSubmit");
	const submitButtonSavingUndefined = ReactTestUtils.findRenderedDOMComponentWithClass(dbFormSavingUndefined, "databaseSchemaSubmit");
	
	expect(submitButtonSavingTrue.value).toBe("Saving...");
	expect(submitButtonSavingFalse.value).not.toBe("Saving...");
	expect(submitButtonSavingUndefined.value).not.toBe("Saving...");
});