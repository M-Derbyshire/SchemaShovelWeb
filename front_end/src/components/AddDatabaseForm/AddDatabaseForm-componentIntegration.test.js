import AddDatabaseForm from './AddDatabaseForm';
import ReactTestUtils from 'react-dom/test-utils';
import sleep from '../testingHelpers/sleepFunc';

const fakeFormOnSubmit = (name, json) => {};
const fakeOnErrorHandler = (name, json) => {};
const fakeOnCancelHandler = (name, json) => {};


test("AddDatabaseForm will pass the dbJSON and fileText states, and their setting functions, to TextFileInput", () => {
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "TextFileTextArea");
	
	expect(textarea.value).toBe("");
	ReactTestUtils.Simulate.change(textarea, { "target": { "value": "1" }});
	expect(textarea.value).toBe("1");
});



test("AddDatabaseForm will pass the onErrorHandler prop to TextFileInput", async () => {
	
	const mockErrorHandler = jest.fn();
	
	const dbForm = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={mockErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100} />);
	
	const fileInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "TextFileFileInput");
	
	//Will cause an exception
	const file = null; 
	ReactTestUtils.Simulate.change(fileInput, { target: { files: [file] } });
	
	await sleep(100);
	
	expect(mockErrorHandler).toBeCalled();
});


test.each([
	[undefined],
	[true],
	[false]
])("AddDatabaseForm will pass the disabled prop down to TextFileInput", (isDisabled) => {
	
	const dbFormDisabled = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={100}
		disabled={isDisabled} />);
	
	const textareaDisabled = 
		ReactTestUtils.findRenderedDOMComponentWithTag(dbFormDisabled, "textarea");
	
	if(!isDisabled)
		expect(textareaDisabled).not.toBeDisabled();
	else
		expect(textareaDisabled).toBeDisabled();
});

test.each([
	[1],
	[2]
])("AddDatabaseForm will pass its dbNameCharLimit prop to the name input", async (charLimit) => {
	
	const addition = ReactTestUtils.renderIntoDocument(<AddDatabaseForm 
		formOnSubmit={fakeFormOnSubmit}
		onErrorHandler={fakeOnErrorHandler}
		onCancelHandler={fakeOnCancelHandler}
		dbNameCharLimit={charLimit} />);
	
	const textInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	
	expect(textInput.getAttribute("maxLength")).toBe(charLimit.toString());
});