import DatabaseListOptions from './DatabaseListOptions';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import sleep from '../testingHelpers/sleepFunc';

const fakeDeletedSelectedDatabase = () => {}

test("DatabaseListOptions will create buttons for loading, deleting and adding databases", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={fakeDeletedSelectedDatabase}
				selectedDatabaseID={0}/>
		</MemoryRouter>
	);
	
	const loadButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "loadDatabaseButton");
	const newButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "addNewDatabaseButton");
	const deleteButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "deleteDatabaseButton");
	
	expect(loadButtons.length).toBe(1);
	expect(newButtons.length).toBe(1);
	expect(deleteButtons.length).toBe(1);
});

test("DatabaseListOptions will disable it's load and delete buttons, if selected ID is less than 0", () => {
	
	const options1 = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={fakeDeletedSelectedDatabase}
				selectedDatabaseID={-1}/>
		</MemoryRouter>
	);
	const loadButton1 = ReactTestUtils.findRenderedDOMComponentWithClass(options1, "loadDatabaseButton");
	const deleteButton1 = ReactTestUtils.findRenderedDOMComponentWithClass(options1, "deleteDatabaseButton");
	
	const options2 = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={fakeDeletedSelectedDatabase}
				selectedDatabaseID={-2}/>
		</MemoryRouter>
	);
	const loadButton2 = ReactTestUtils.findRenderedDOMComponentWithClass(options2, "loadDatabaseButton");
	const deleteButton2 = ReactTestUtils.findRenderedDOMComponentWithClass(options2, "deleteDatabaseButton");
	
	const options3 = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={fakeDeletedSelectedDatabase}
				selectedDatabaseID={-52}/>
		</MemoryRouter>
	);
	const loadButton3 = ReactTestUtils.findRenderedDOMComponentWithClass(options3, "loadDatabaseButton");
	const deleteButton3 = ReactTestUtils.findRenderedDOMComponentWithClass(options3, "deleteDatabaseButton");
	
	
	expect(loadButton1).toBeDisabled();
	expect(loadButton2).toBeDisabled();
	expect(loadButton3).toBeDisabled();
	expect(deleteButton1).toBeDisabled();
	expect(deleteButton2).toBeDisabled();
	expect(deleteButton3).toBeDisabled();
});

test("DatabaseListOptions will run the function passed as the deleteSelectedDatabase prop when the delete button is pressed", () => {
	
	const mockDeleteSelectedDatabase = jest.fn();
	
	const options = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={mockDeleteSelectedDatabase}
				selectedDatabaseID={1}/>
		</MemoryRouter>
	);
	const deleteButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "deleteDatabaseButton");
	
	ReactTestUtils.Simulate.click(deleteButton);
	
	expect(mockDeleteSelectedDatabase).toHaveBeenCalled();
	
});

test("DatabaseListOptions will disable the create/load/delete buttons after pressing delete, then re-enable them afterwards", async () => {
	
	const mockDeleteSelectedDatabase = jest.fn();
	
	const options = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={mockDeleteSelectedDatabase}
				selectedDatabaseID={1}/>
		</MemoryRouter>
	);
	const deleteButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "deleteDatabaseButton");
	const createButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "addNewDatabaseButton");
	const loadButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "loadDatabaseButton");
	
	expect(deleteButton).not.toBeDisabled();
	expect(createButton).not.toBeDisabled();
	expect(loadButton).not.toBeDisabled();
	
	ReactTestUtils.Simulate.click(deleteButton);
	expect(deleteButton).toBeDisabled();
	expect(createButton).toBeDisabled();
	expect(loadButton).toBeDisabled();
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	expect(deleteButton).not.toBeDisabled();
	expect(createButton).not.toBeDisabled();
	expect(loadButton).not.toBeDisabled();
});

test("DatabaseListOptions will re-enable its buttons after an exception is thrown during database deletion", async () => {
	
	const mockDeleteSelectedDatabase = jest.fn().mockImplementation(() => {
		throw new Error('Test error');
	});
	
	const options = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions
				deleteSelectedDatabase={mockDeleteSelectedDatabase}
				selectedDatabaseID={1}/>
		</MemoryRouter>
	);
	const deleteButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "deleteDatabaseButton");
	const createButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "addNewDatabaseButton");
	const loadButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "loadDatabaseButton");
	
	ReactTestUtils.Simulate.click(deleteButton);
	
	//We're dealing with asynchronous methods, so let it load
	await sleep(100);
	
	expect(deleteButton).not.toBeDisabled();
	expect(createButton).not.toBeDisabled();
	expect(loadButton).not.toBeDisabled();
});

test("DatabaseListOptions will route to /create when the add database button is pressed", () => {
	
	let testHistory, testLocation;
	const options = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseListOptions deleteSelectedDatabase={()=>{}} selectedDatabaseID={1}/>
			<Route path="*" render={({ history, location }) => {
				testHistory = history;
				testLocation = location;
				return null;
			}}/>
		</MemoryRouter>
	);
	
	expect(testLocation.pathname).not.toBe("/create");
	
	const createButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "addNewDatabaseButton");
	ReactTestUtils.Simulate.click(createButton);
	
	expect(testLocation.pathname).toBe("/create");
});