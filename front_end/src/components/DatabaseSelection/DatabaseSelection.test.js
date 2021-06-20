import DatabaseSelection from './DatabaseSelection';
import ReactTestUtils from 'react-dom/test-utils';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import sleep from '../testingHelpers/sleepFunc';

test("DatabaseSelection will render a single SelectableList component", () => {
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection />);
	
	const selectableList = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "SelectableList");
	
	expect(ReactTestUtils.isDOMComponent(selectableList)).toBeTruthy();
});

test("DatabaseSelection will load the database list, and pass it to the SelectableList as EditableItems", async () => {
	
	const testName = "testName";
	
	const mockAPIAccessor = new MockAPIAccessor([
		[ { id: 1, name: testName } ]
	]);
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection apiAccessor={mockAPIAccessor} />);
	
	//trigger didUpdate handler, that should then trigger the load of the database list
	databaseSelection._forceDidUpdateHandlerForTests();
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const editableItemText = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "EIStaticText");
	
	expect(editableItemText.textContent).toEqual(testName);
});

test("DatabaseSelection will pass the apiAccessor's updateDatabaseName() method to database EditableItems", async () => {
	
	const testName = "testName";
	const testID = 1;
	const changedName = "testChange";
	
	const mockAPIAccessor = new MockAPIAccessor([
		[ { id: testID, name: testName } ]
	]);
	mockAPIAccessor.updateDatabaseName = jest.fn();
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection apiAccessor={mockAPIAccessor} />);
	
	//trigger didUpdate handler, that should then trigger the load of the database list
	databaseSelection._forceDidUpdateHandlerForTests();
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton);
	
	//Edit the text
	const textInput = ReactTestUtils.findRenderedDOMComponentWithTag(databaseSelection, "input");
	ReactTestUtils.Simulate.change(textInput, { "target": { "value": changedName }});
	
	//Click save
	const saveButton = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "EISaveButton");
	ReactTestUtils.Simulate.click(saveButton);
	
	expect(mockAPIAccessor.updateDatabaseName).toHaveBeenCalledWith(testID, changedName);
	
});

test("DatabaseSelection will render a single DatabaseListOptions component", () => {
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection />);
	
	const DatabaseListOptions = 
		ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "DatabaseListOptions");
	
	expect(ReactTestUtils.isDOMComponent(DatabaseListOptions)).toBeTruthy();
});

test("DatabaseSelection's SelectableList will be set to loading when there's no database data loaded.", () => {
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection />);
	
	const li = ReactTestUtils.findRenderedDOMComponentWithTag(databaseSelection, "li");
	
	//Wanted to check this specifically in the SelectableList, but you can't test the internals of an 
	//inner component with ReactTestUtils.
	expect(li.textContent.toLowerCase()).toEqual(expect.stringContaining("loading"));
});

test("DatabaseSelection will pass the SelectableList hasFailedToLoad prop as true, if there are errors loading the list.", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([]);
	mockAPIAccessor.throwOnNextRequest();
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection apiAccessor={mockAPIAccessor} />);
	
	//trigger didUpdate handler, that should then trigger the load of the database list
	databaseSelection._forceDidUpdateHandlerForTests();
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const li = ReactTestUtils.findRenderedDOMComponentWithTag(databaseSelection, "li");
	
	//Wanted to check this specifically in the SelectableList, but you can't test the internals of an 
	//inner component with ReactTestUtils.
	expect(li.textContent.toLowerCase()).toEqual(expect.stringContaining("an error has occurred"));
});