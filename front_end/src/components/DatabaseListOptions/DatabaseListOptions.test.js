import DatabaseListOptions from './DatabaseListOptions';
import ReactTestUtils from 'react-dom/test-utils';

const fakeDeletedSelectedDatabase = () => {}

test("DatabaseListOptions will create buttons for loading, deleting and adding databases", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseListOptions
			deleteSelectedDatabase={fakeDeletedSelectedDatabase}
			selectedDatabaseID={0}/>
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
		<DatabaseListOptions
			deleteSelectedDatabase={fakeDeletedSelectedDatabase}
			selectedDatabaseID={-1}/>
	);
	const loadButton1 = ReactTestUtils.findRenderedDOMComponentWithClass(options1, "loadDatabaseButton");
	const deleteButton1 = ReactTestUtils.findRenderedDOMComponentWithClass(options1, "deleteDatabaseButton");
	
	const options2 = ReactTestUtils.renderIntoDocument(
		<DatabaseListOptions
			deleteSelectedDatabase={fakeDeletedSelectedDatabase}
			selectedDatabaseID={-2}/>
	);
	const loadButton2 = ReactTestUtils.findRenderedDOMComponentWithClass(options2, "loadDatabaseButton");
	const deleteButton2 = ReactTestUtils.findRenderedDOMComponentWithClass(options2, "deleteDatabaseButton");
	
	const options3 = ReactTestUtils.renderIntoDocument(
		<DatabaseListOptions
			deleteSelectedDatabase={fakeDeletedSelectedDatabase}
			selectedDatabaseID={-52}/>
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
		<DatabaseListOptions
			deleteSelectedDatabase={mockDeleteSelectedDatabase}
			selectedDatabaseID={1}/>
	);
	const deleteButton = ReactTestUtils.findRenderedDOMComponentWithClass(options, "deleteDatabaseButton");
	
	ReactTestUtils.Simulate.click(deleteButton);
	
	expect(mockDeleteSelectedDatabase).toHaveBeenCalled();
	
});

