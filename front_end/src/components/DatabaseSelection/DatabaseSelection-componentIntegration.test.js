import DatabaseSelection from './DatabaseSelection';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import sleep from '../testingHelpers/sleepFunc';

test("DatabaseSelection will load the database list, and pass it to the SelectableList as EditableItems", async () => {
	
	const testName = "testName";
	
	const mockAPIAccessor = new MockAPIAccessor([
		[ { id: 1, name: testName } ]
	]);
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection 
				apiAccessor={mockAPIAccessor}
				dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const editableItemText = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "EIStaticText");
	
	expect(editableItemText.textContent).toEqual(testName);
});

test("DatabaseSelection will pass the apiAccessor's updateDatabaseName() method to EditableItems", async () => {
	
	const testName = "testName";
	const testID = 1;
	const changedName = "testChange";
	
	const mockAPIAccessor = new MockAPIAccessor([
		[ { id: testID, name: testName } ]
	]);
	mockAPIAccessor.updateDatabaseName = jest.fn();
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection 
				apiAccessor={mockAPIAccessor}
				dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton);
	
	//Edit the text
	const textInput = ReactTestUtils.findRenderedDOMComponentWithTag(databaseSelectionRouter, "input");
	ReactTestUtils.Simulate.change(textInput, { "target": { "value": changedName }});
	
	//Click save
	const saveButton = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "EISaveButton");
	ReactTestUtils.Simulate.click(saveButton);
	
	expect(mockAPIAccessor.updateDatabaseName).toHaveBeenCalledWith(testID, changedName);
	
});

test.each([
	[1],
	[2]
])("DatabaseSelection will pass the dbNameCharLimit prop to EditableItems", async (lengthLimit) => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		[ { id: 1, name: "1" } ]
	]);
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection 
				apiAccessor={mockAPIAccessor} 
				dbNameCharLimit={lengthLimit} />
		</MemoryRouter>
	);
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton); //Enter edit mode
	const textInput = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "EITextInput");
	
	expect(textInput.getAttribute("maxLength")).toBe(lengthLimit.toString())
});

test("DatabaseSelection will pass the deleteSelectedDatabase func to the DatabaseListOptions", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		[ { id: 1, name: "testName" }, { id: 2, name: "testName" }, { id: 3, name: "testName" } ]
	]);
	mockAPIAccessor.deleteDatabase = jest.fn();
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection 
				apiAccessor={mockAPIAccessor}
				dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const dbLiItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(databaseSelectionRouter, "li");
	ReactTestUtils.Simulate.click(dbLiItems[1]);
	
	//This means id passed in should be 2
	
	const deleteButton = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "deleteDatabaseButton");
	ReactTestUtils.Simulate.click(deleteButton);
	
	expect(mockAPIAccessor.deleteDatabase).toHaveBeenCalledWith(2);
});

test("DatabaseSelection's will pass the SelectableList isLoading prop as true when there's no database data loaded.", () => {
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	const li = ReactTestUtils.findRenderedDOMComponentWithTag(databaseSelectionRouter, "li");
	
	//Wanted to check this specifically in the SelectableList, but you can't test the internals of an 
	//inner component with ReactTestUtils.
	expect(li.textContent.toLowerCase()).toEqual(expect.stringContaining("loading"));
});

test("DatabaseSelection will pass the SelectableList hasFailedToLoad prop as true, if there are errors loading the list.", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([]);
	mockAPIAccessor.throwOnNextRequest();
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection 
				apiAccessor={mockAPIAccessor}
				dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	const li = ReactTestUtils.findRenderedDOMComponentWithTag(databaseSelectionRouter, "li");
	
	//Wanted to check this specifically in the SelectableList, but you can't test the internals of an 
	//inner component with ReactTestUtils.
	expect(li.textContent.toLowerCase()).toEqual(expect.stringContaining("an error has occurred"));
});