import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import sleep from '../testingHelpers/sleepFunc';
import DatabaseViewer from './DatabaseViewer';

test("DatabaseViewer will pass the full schema list to DatabaseEntityFilterOptions (even when a filter is applied)", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		{ id: 1, name: "dbTitle", schemas: [
			{ id: 1, name: "match", description: "", tables: [] },
			{ id: 2, name: "other", description: "", tables: [] },
		]},
	]);
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	await sleep(100); //Await the async load method finishing
	
	const schemaTextFilterInput = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "schemaTextFilterInput");
	const textFilterRunBtn = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "textFilterRunBtn");
	
	//This will only match one of the mock schemas
	ReactTestUtils.Simulate.change(schemaTextFilterInput, { "target": { "value": "match" } });
	ReactTestUtils.Simulate.click(textFilterRunBtn);
	
	const fkSchemaOptions = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbViewer, "option");
	
	const titleElem = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "dbViewerTitle");
	
	//This is 4, not 2, as the first in both lists is the blank -1 value
	expect(fkSchemaOptions.length).toBe(4);
});



// DatabaseViewer will pass the runTextFilter method to the DatabaseEntityFilterOptions

// DatabaseViewer will pass the runFkFilter method to the DatabaseEntityFilterOptions

