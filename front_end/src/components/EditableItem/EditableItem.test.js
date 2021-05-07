import EditableItem from './EditableItem';
import ReactTestUtils from 'react-dom/test-utils';

const fakeSaveChanges = (x) => {};

test("EditableItem will display the given text as a text node (not in an input) when not in edit mode", () => {
	
	const item = ReactTestUtils.renderIntoDocument(<EditableItem saveChanges={fakeSaveChanges} text="testing123" />);
	
	const span = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EIStaticText");
	const textArea = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, "input");
	
	expect(span.textContent).toBe("testing123");
	expect(textArea.length).toBe(0);
});

test("EditableItem will display an edit button when not in edit mode", () => {
	
	const item = ReactTestUtils.renderIntoDocument(<EditableItem saveChanges={fakeSaveChanges} text="testing123" />);
	
	const button = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EIEditButton");
	
	expect(button.length).toBe(1);
});

test("EditableItem will display a textinput (with the given text), and save/cancel buttons if in edit mode", () => {
	
	const item = ReactTestUtils.renderIntoDocument(<EditableItem saveChanges={fakeSaveChanges} text="testing123" />);
	
	const originalEditButton = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EIEditButton");
	ReactTestUtils.Simulate.click(originalEditButton);
	
	//These shouldn't exist
	const span = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EIStaticText");
	const editButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EIEditButton");
	expect(span.length).toBe(0);
	expect(editButton.length).toBe(0);
	
	//These should exist
	const textArea = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, "input");
	const saveButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EISaveButton");
	const cancelButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EICancelChangeButton");
	
	expect(saveButton.length).toBe(1);
	expect(cancelButton.length).toBe(1);
	expect(textArea.length).toBe(1);
	
	expect(textArea[0].getAttribute("value")).toBe("testing123");
	
});

test("When EditableItem is in edit mode, the cancel button will return to you to regular mode, without changing the text", () => {
	
	const item = ReactTestUtils.renderIntoDocument(<EditableItem saveChanges={fakeSaveChanges} text="testing123" />);
	
	//Enter edit mode
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton);
	
	//Confirm we're in edit mode
	const EICancelChangeButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EICancelChangeButton");
	expect(EICancelChangeButton.length).toBe(1);
	
	//Edit the text
	const textArea = ReactTestUtils.findRenderedDOMComponentWithTag(item, "input");
	textArea.setAttribute("value", "test2");
	
	//Exit edit mode
	ReactTestUtils.Simulate.click(EICancelChangeButton[0]);
	
	//Should exist
	const span = ReactTestUtils.scryRenderedDOMComponentsWithClass(item, "EIStaticText");
	
	//Should not exist
	const newTextArea = ReactTestUtils.scryRenderedDOMComponentsWithTag(item, "input");
	
	expect(span.length).toBe(1);
	expect(span[0].textContent).toBe("testing123");
	expect(newTextArea.length).toBe(0);
	
});

test("When EditableItem is being saved, the save button will become disabled", () => {
	
	const item = ReactTestUtils.renderIntoDocument(<EditableItem saveChanges={fakeSaveChanges} text="testing123" />);
	
	//Enter edit mode
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton);
	
	//Check is enabled
	const saveButton = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EISaveButton");
	
	expect(saveButton).not.toBeDisabled();
	
	ReactTestUtils.Simulate.click(saveButton);
	
	//Check is disabled
	expect(saveButton).toBeDisabled();
});

test("When EditableItem is being saved, the saveChanges prop function will be called with the new text", () => {
	
	const mockSaveChanges = jest.fn();
	
	const item = ReactTestUtils.renderIntoDocument(<EditableItem saveChanges={mockSaveChanges} text="testing123" />);
	
	//Enter edit mode
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton);
	
	//Edit the text
	const textInput = ReactTestUtils.findRenderedDOMComponentWithTag(item, "input");
	ReactTestUtils.Simulate.change(textInput, { "target": { "value": "test2" }});
	
	//Click save
	const saveButton = ReactTestUtils.findRenderedDOMComponentWithClass(item, "EISaveButton");
	ReactTestUtils.Simulate.click(saveButton);
	
	//Check has ran
	expect(mockSaveChanges).toHaveBeenCalledWith("test2");
});