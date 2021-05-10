import DatabaseLoadOptions from './DatabaseLoadOptions';
import ReactTestUtils from 'react-dom/test-utils';

const fakeLoadSelectedDatabase = (i) => {}

test("DatabaseLoadOptions will create buttons for loading and adding databases", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={fakeLoadSelectedDatabase}
			selectedDatabaseIndex={0}/>
	);
	
	const loadButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "loadDatabaseButton");
	const newButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "addNewDatabaseButton");
	
	expect(loadButton.length).toBe(1);
	expect(newButton.length).toBe(1);
});

test("DatabaseLoadOptions will disable it's load database button, if selected index is less than 0", () => {
	
	const options1 = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={fakeLoadSelectedDatabase}
			selectedDatabaseIndex={-1}/>
	);
	const loadButton1 = ReactTestUtils.findRenderedDOMComponentWithClass(options1, "loadDatabaseButton");
	
	const options2 = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={fakeLoadSelectedDatabase}
			selectedDatabaseIndex={-2}/>
	);
	const loadButton2 = ReactTestUtils.findRenderedDOMComponentWithClass(options2, "loadDatabaseButton");
	
	const options3 = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={fakeLoadSelectedDatabase}
			selectedDatabaseIndex={-52}/>
	);
	const loadButton3 = ReactTestUtils.findRenderedDOMComponentWithClass(options3, "loadDatabaseButton");
	
	
	expect(loadButton1).toBeDisabled();
	expect(loadButton2).toBeDisabled();
	expect(loadButton3).toBeDisabled();
	
});

test("DatabaseLoadOptions will run the function passed as the loadSelectedDatabase prop, with the index as a parameter, when the load button is pressed", () => {
	
	const mockLoadSelectedDatabase = jest.fn();
	
	const options0 = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={mockLoadSelectedDatabase}
			selectedDatabaseIndex={0}/>
	);
	const loadButton0 = ReactTestUtils.findRenderedDOMComponentWithClass(options0, "loadDatabaseButton");
	
	const options1 = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={mockLoadSelectedDatabase}
			selectedDatabaseIndex={1}/>
	);
	const loadButton1 = ReactTestUtils.findRenderedDOMComponentWithClass(options1, "loadDatabaseButton");
	
	const options2 = ReactTestUtils.renderIntoDocument(
		<DatabaseLoadOptions
			loadSelectedDatabase={mockLoadSelectedDatabase}
			selectedDatabaseIndex={2}/>
	);
	const loadButton2 = ReactTestUtils.findRenderedDOMComponentWithClass(options2, "loadDatabaseButton");
	
	
	ReactTestUtils.Simulate.click(loadButton0);
	ReactTestUtils.Simulate.click(loadButton1);
	ReactTestUtils.Simulate.click(loadButton2);
	
	expect(mockLoadSelectedDatabase).toHaveBeenNthCalledWith(1, 0);
	expect(mockLoadSelectedDatabase).toHaveBeenNthCalledWith(2, 1);
	expect(mockLoadSelectedDatabase).toHaveBeenNthCalledWith(3, 2);
	
});