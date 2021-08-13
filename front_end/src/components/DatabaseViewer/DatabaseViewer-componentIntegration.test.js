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



//This technically tests 2 things at once (for DatabaseEntityFilterOptions, and AnchorList),
//but if we didn't do that, we would just be repeating the exact same tests for each thing tested here
test("DatabaseViewer will pass the runTextFilter method to the DatabaseEntityFilterOptions, and pass the anchorObjects to AnchorList", async () => {
	
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
	
	const anchors = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "entityAnchor");
	expect(anchors.length).toBe(2);
	
	//This will only match one of the mock schemas
	ReactTestUtils.Simulate.change(schemaTextFilterInput, { "target": { "value": "match" } });
	ReactTestUtils.Simulate.click(textFilterRunBtn);
	
	const anchorsFiltered = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "entityAnchor");
	expect(anchorsFiltered.length).toBe(1);
});


//This technically tests 2 things at once (for DatabaseEntityFilterOptions, and AnchorList),
//but if we didn't do that, we would just be repeating the exact same tests for each thing tested here
test("DatabaseViewer will pass the runFkFilter method to the DatabaseEntityFilterOptions, and pass the fkSubjectTable anchor to AnchorList", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		{ id: 1, name: "dbTitle", schemas: [
			{ id: 1, name: "schema1", description: "", tables: [
				{ id: 1, name: "subject", description: "", columns: [] },
				{ id: 2, name: "fk", description: "", columns: [
					{ id: 1, name: "fkID", description: "", fkToTableId: 1 },
				] },
			] }
		]},
	]);
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	await sleep(100); //Await the async load method finishing
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkTableSelect");
	const runBtn = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkFilterRunBtn");
	
	const anchors = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "entityAnchor");
	expect(anchors[0].textContent).toEqual(expect.not.stringContaining("subject"));
	
	//This will only match one of the mock schemas
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: 1 } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: 1 } });
	ReactTestUtils.Simulate.click(runBtn);
	
	const anchorsFiltered = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "entityAnchor");
	
	expect(anchorsFiltered[0].textContent).toEqual(expect.stringContaining("subject"));
});



// DatabaseViewer will pass the full table label list to DatabaseEntityList (even after a filter, it will be the full list)