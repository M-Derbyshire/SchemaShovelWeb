import DatabaseSelection from './DatabaseSelection';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import sleep from '../testingHelpers/sleepFunc';

test("DatabaseSelection will render a single SelectableList component", () => {
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	const selectableList = 
			ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "SelectableList");
	
	expect(ReactTestUtils.isDOMComponent(selectableList)).toBeTruthy();
});

test("DatabaseSelection will render a single DatabaseListOptions component", () => {
	
	const databaseSelectionRouter = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseSelection dbNameCharLimit={45} />
		</MemoryRouter>
	);
	
	const DatabaseListOptions = 
		ReactTestUtils.findRenderedDOMComponentWithClass(databaseSelectionRouter, "DatabaseListOptions");
		
	expect(ReactTestUtils.isDOMComponent(DatabaseListOptions)).toBeTruthy();
});