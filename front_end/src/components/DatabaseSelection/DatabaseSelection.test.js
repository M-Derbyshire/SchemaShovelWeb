import DatabaseSelection from './DatabaseSelection';
import ReactTestUtils from 'react-dom/test-utils';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import sleep from '../testingHelpers/sleepFunc';

test("DatabaseSelection will render a single SelectableList component", () => {
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection />);
	
	const selectableList = ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "SelectableList");
	
	expect(ReactTestUtils.isDOMComponent(selectableList)).toBeTruthy();
});

test("DatabaseSelection will render a single DatabaseListOptions component", () => {
	
	const databaseSelection = ReactTestUtils.renderIntoDocument(<DatabaseSelection />);
	
	const DatabaseListOptions = 
		ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelection, "DatabaseListOptions");
		
	expect(ReactTestUtils.isDOMComponent(DatabaseListOptions)).toBeTruthy();
});