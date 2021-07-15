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
		onCancelHandler={fakeOnCancelHandler} />);
	
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
		onCancelHandler={fakeOnCancelHandler} />);
	
	const fileInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbForm, "TextFileFileInput");
	
	//Will cause an exception
	const file = null; 
	ReactTestUtils.Simulate.change(fileInput, { target: { files: [file] } });
	
	await sleep(100);
	
	expect(mockErrorHandler).toBeCalled();
});


test("AddDatabaseForm will pass the disabled prop down to TextFileInput", () => {
	
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
	
	const textareaDisabledUndefined = 
		ReactTestUtils.findRenderedDOMComponentWithTag(dbFormDisabledUndefined, "textarea");
	const textareaDisabledFalse = 
		ReactTestUtils.findRenderedDOMComponentWithTag(dbFormDisabledFalse, "textarea");
	const textareaDisabledTrue = 
		ReactTestUtils.findRenderedDOMComponentWithTag(dbFormDisabledTrue, "textarea");
	
	expect(textareaDisabledUndefined).not.toBeDisabled();
	expect(textareaDisabledFalse).not.toBeDisabled();
	expect(textareaDisabledTrue).toBeDisabled();
});