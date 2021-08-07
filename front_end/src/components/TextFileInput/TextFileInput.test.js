import TextFileInput from './TextFileInput';
import ReactTestUtils from 'react-dom/test-utils';
import sleep from '../testingHelpers/sleepFunc';

const fakeErrorHandler = (err) => {};
const fakeSetFileText = (text) => {};

test("TextFileInput will disable its inputs if the disabled prop is true.", () => {
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		setFileText={fakeSetFileText} 
		onErrorHandler={fakeErrorHandler}
		disabled={true} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textfileinput, "textarea");
	const fileinput = ReactTestUtils.findRenderedDOMComponentWithClass(textfileinput, "TextFileFileInput");
	
	expect(textarea).toBeDisabled();
	expect(fileinput).toBeDisabled();
});

test.each([
	[false],
	[undefined]
])("TextFileInput will not disable its inputs if the disabled prop is false, or undefined.", (isDisabled) => {
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		setFileText={fakeSetFileText} 
		onErrorHandler={fakeErrorHandler}
		disabled={isDisabled} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textfileinput, "textarea");
	const fileinput = 
		ReactTestUtils.findRenderedDOMComponentWithClass(textfileinput, "TextFileFileInput");
	
	expect(textarea).not.toBeDisabled();
	expect(fileinput).not.toBeDisabled();
});


test("TextFileInput will set the textarea to the given fileText prop's value", () => {
	
	const testFileText = "testing123";
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		fileText={testFileText}
		setFileText={fakeSetFileText} 
		onErrorHandler={fakeErrorHandler} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textfileinput, "textarea");
	
	expect(textarea.value).toBe(testFileText);
});

test("TextFileInput will set the textarea to be empty if the fileText prop is undefined", () => {
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		setFileText={fakeSetFileText} 
		onErrorHandler={fakeErrorHandler} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textfileinput, "textarea");
	
	expect(textarea.value).toBe("");
});

test("TextFileInput will call the setFileText prop function when the textarea has changed", () => {
	
	const mockSetFileText = jest.fn();
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		fileText="1" 
		setFileText={mockSetFileText} 
		onErrorHandler={fakeErrorHandler} />);
	
	const textarea = ReactTestUtils.findRenderedDOMComponentWithTag(textfileinput, "textarea");
	ReactTestUtils.Simulate.change(textarea, { "target": { "value": "12" }});
	
	expect(mockSetFileText).toBeCalledWith("12");
});

test("TextFileInput will call the setFileText prop function when the fileInput has changed, with the file text", async () => {
	
	const mockSetFileText = jest.fn();
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		fileText="1" 
		setFileText={mockSetFileText} 
		onErrorHandler={fakeErrorHandler} />);
	
	const fileInput = ReactTestUtils.findRenderedDOMComponentWithClass(textfileinput, "TextFileFileInput");
	const file = new File(['testing'], 'chucknorris.txt', { type: '.txt' });
	ReactTestUtils.Simulate.change(fileInput, { target: { files: [file] } });
	
	await sleep(100);
	
	expect(mockSetFileText).toBeCalledWith("testing");
});

test("TextFileInput will call the onErrorHandler prop function if there is an exception during file upload", async () => {
	
	const mockErrorHandler = jest.fn();
	
	const textfileinput = ReactTestUtils.renderIntoDocument(<TextFileInput 
		fileText="1" 
		setFileText={fakeSetFileText} 
		onErrorHandler={mockErrorHandler} />);
	
	const fileInput = ReactTestUtils.findRenderedDOMComponentWithClass(textfileinput, "TextFileFileInput");
	
	//Will cause an exception
	const file = null; 
	ReactTestUtils.Simulate.change(fileInput, { target: { files: [file] } });
	
	await sleep(100);
	
	expect(mockErrorHandler).toBeCalled();
});