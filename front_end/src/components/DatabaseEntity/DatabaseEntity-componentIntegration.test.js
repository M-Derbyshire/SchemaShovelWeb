import ReactTestUtils from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';
import DatabaseEntity from './DatabaseEntity';

const dummyDescChange = async () => {};
const dummyDescChangeErrorHandler = async () => {};


test.each([
	["testDesc1"],
	["testDesc2"]
])("DatabaseEntity will pass the description on to an EditableItem", (description) => {
	
	const dbEntity = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity 
			elementID="1"
			name="name"
			description={description}
			color="#000000"
			saveDescriptionChanges={dummyDescChange}
			saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={1000}
		 />
	);
	
	const editableItemText = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EITextArea");
	
	expect(editableItemText.textContent).toEqual(description);
	
});

test("DatabaseEntity will pass the saveDescriptionChanges prop on to the EditableItem", () => {
	
	const mockSaveDesc = jest.fn().mockResolvedValueOnce("{}");
	
	const dbEntity = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity 
			elementID="1"
			name="name"
			description="desc"
			color="#000000"
			saveDescriptionChanges={mockSaveDesc}
			saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={1000}
		 />
	);
	
	const editableItemEditButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EIEditButton");
	ReactTestUtils.Simulate.click(editableItemEditButton);
	const editableItemSaveButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EISaveButton");
	ReactTestUtils.Simulate.click(editableItemSaveButton);
	
	expect(mockSaveDesc).toHaveBeenCalled();
});

test("DatabaseEntity will pass the saveDescriptionErrorHandler prop on to the EditableItem", async () => {
	
	const mockSaveDesc = jest.fn().mockRejectedValueOnce(new Error("fail"));
	const mockErrorHandler = jest.fn();
	
	const dbEntity = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity 
			elementID="1"
			name="name"
			description="desc"
			color="#000000"
			saveDescriptionChanges={mockSaveDesc}
			saveDescriptionErrorHandler={mockErrorHandler}
			descriptionCharLengthLimit={1000}
		 />
	);
	
	const editableItemEditButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EIEditButton");
	ReactTestUtils.Simulate.click(editableItemEditButton);
	const editableItemSaveButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EISaveButton");
	ReactTestUtils.Simulate.click(editableItemSaveButton);
	
	await waitFor(() => expect(mockErrorHandler).toHaveBeenCalled());
	
});


test.each([
	[100],
	[200]
])("DatabaseEntity will pass the descriptionCharLengthLimit prop on to the EditableItem", (textLimit) => {
	
	const dbEntity = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity 
			elementID="1"
			name="name"
			description="desc"
			color="#000000"
			saveDescriptionChanges={dummyDescChange}
			saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={textLimit}
		 />
	);
	
	const editableItemEditButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EIEditButton");
	ReactTestUtils.Simulate.click(editableItemEditButton);
	const editableItemInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntity, "EITextInput");
	
	expect(editableItemInput.getAttribute("maxLength")).toEqual(textLimit.toString());
});