import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import { wait, waitFor, screen } from '@testing-library/react';
import EntityElementIdGenerator from '../../EntityElementIdGenerator/EntityElementIdGenerator';
import DatabaseViewer from './DatabaseViewer';

test.each("DatabaseViewer will pass apiAccessor to DatabaseEntityList", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		{ id: 1, name: "dbTitle", schemas: [
			{ id: 1, name: "schemaName", description: "", color: "", tables: []}
		]}
	]);
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const dbEntities = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "DatabaseEntity");
		
		//Will have loaded the db entities with the apiAccessor
		expect(dbEntities.length).toEqual(1);
	});
	
});

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
	
	await waitFor(() => {
		expect(screen.queryByText(/loading/i)).toBeNull();
	});
	
	const schemaTextFilterInput = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "schemaTextFilterInput");
	const textFilterRunBtn = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "textFilterRunBtn");
	
	//This will only match one of the mock schemas
	ReactTestUtils.Simulate.change(schemaTextFilterInput, { "target": { "value": "match" } });
	ReactTestUtils.Simulate.click(textFilterRunBtn);
	
	await waitFor(() => {
		
		const fkSchemaOptions = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbViewer, "option");
		
		const titleElem = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "dbViewerTitle");
		
		//This is 4, not 2, as the first in both lists is the blank -1 value
		expect(fkSchemaOptions.length).toBe(4);
	});
	
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
	
	await waitFor(() => {
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
	
	await waitFor(() => {
		const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkSchemaSelect");
		const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkTableSelect");
		const runBtn = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkFilterRunBtn");
		
		const anchors = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "entityAnchor");
		expect(anchors[0].textContent).toEqual(expect.not.stringContaining("subject"));
		
		//This will only match one of the mock tables
		ReactTestUtils.Simulate.change(schemaSelect, { target: { value: 1 } });
		ReactTestUtils.Simulate.change(tableSelect, { target: { value: 1 } });
		ReactTestUtils.Simulate.click(runBtn);
		
		const anchorsFiltered = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "entityAnchor");
		
		expect(anchorsFiltered[0].textContent).toEqual(expect.stringContaining("subject"));
	});
	
});



// 
test("DatabaseViewer will pass the full table label list to DatabaseEntityList (even after a filter, it will be the full list)", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		{ id: 1, name: "dbTitle", schemas: [
			{ id: 1, name: "schema1", description: "", color: "", tables: [
				{ id: 1, name: "table1", description: "", color: "", columns: [
					{ id: 1, name: "", description: "", color: "", fkToTableId: 2 }
				] }
			]},
			{ id: 2, name: "schema2", description: "", color: "", tables: [
				{ id: 2, name: "table2", description: "", color: "", columns: [] }
			]}
		]}
	]);
	
	const tableLabels = [
		{ entityID: 1, label: "schema1.table1" },
		{ entityID: 2, label: "schema2.table2" }
	];
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		expect(screen.queryByText(/loading/i)).toBeNull();
	});
	
	const tableTextFilterInput = 
		ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "tableTextFilterInput");
	const textFilterRunBtn = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "textFilterRunBtn");
	
	//This will only match one of the mock schemas
	ReactTestUtils.Simulate.change(tableTextFilterInput, { "target": { "value": "table1" } });
	ReactTestUtils.Simulate.click(textFilterRunBtn);
	
	await waitFor(() => {
		
		const dbEntities =  ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "DatabaseEntity");
		
		//The column should still have the correct fk to table string
		expect(dbEntities.length).toBe(3);
		expect(dbEntities[2].textContent).toEqual(expect.stringContaining("schema2.table2"));
	});
	
});


test("DatabaseViewer will pass fkFilterSubjectTable to DatabaseEntityList, after an FK filter is run", async () => {
	
	const idGenerator = new EntityElementIdGenerator();
	
	const mockAPIAccessor = new MockAPIAccessor([
		{ id: 1, name: "dbTitle", schemas: [
			{ id: 1, name: "schema1", description: "", color: "", tables: [
				{ id: 1, name: "subjectTable", description: "", color: "", columns: [] }
			] },
			{ id: 2, name: "schema2", description: "", color: "", tables: [
				{ id: 2, name: "notSubjectTable", description: "", color: "", columns: [] }
			]}
		]}
	]);
	
	const subject = { id: 1, name: "subjectTable", description: "", color: "", childEntities: [] };
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	
	await waitFor(() => {
		expect(screen.queryByText(/loading/i)).toBeNull();
	});
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkTableSelect");
	const runBtn = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "fkFilterRunBtn");
	
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: 1 } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: 1 } });
	
	ReactTestUtils.Simulate.click(runBtn);
	
	await waitFor(() => {
		
		const tableID = idGenerator.getIdForTable(subject.id, subject.name);
		
		const dbEntities = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "DatabaseEntity");
		
		expect(dbEntities[0].getAttribute("id")).toEqual(tableID);
	});
	
});



test.each([
	[1],
	[2],
	[3]
])("DatabaseViewer will pass entityDescCharLimit down to DatabaseEntityList", async (charLimit) => {
	
	const mockAPIAccessor = new MockAPIAccessor([
		{ id: 1, name: "dbTitle", schemas: [
			{ id: 1, name: "schemaName", description: "", color: "", tables: []}
		]}
	]);
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={charLimit} />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "EIEditButton");
		ReactTestUtils.Simulate.click(editButton);
		
		const textInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "EITextInput");
		
		expect(textInput.getAttribute("maxLength")).toEqual(charLimit.toString());
	});
	
});