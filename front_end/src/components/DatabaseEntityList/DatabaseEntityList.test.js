import ReactTestUtils from 'react-dom/test-utils';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import DatabaseEntityList from './DatabaseEntityList';


test("DatabaseEntityList will display the DatabaseEntity components in a UL", () => {
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: [
			{ id: 1, name: "table1", description: "", color: "", childEntities: [
				{ id: 1, name: "column1", description: "", color: "" },
				{ id: 2, name: "column2", description: "", color: "" }
			] },
			{ id: 2, name: "table2", description: "", color: "", childEntities: [
				{ id: 3, name: "column3", description: "", color: "" },
				{ id: 4, name: "column4", description: "", color: "" }
			] },
		]},
		{ id: 2, name: "schema2", description: "", childEntities: [],  color: ""},
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	
	const uls = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbEntityList, "ul");
	
	//A schema ul, 1 table ul, and 2 column uls
	expect(uls.length).toBe(4);
	expect(uls[0].textContent).toEqual(expect.stringContaining("schema1"));
	expect(uls[0].textContent).toEqual(expect.stringContaining("schema2"));
	expect(uls[1].textContent).toEqual(expect.stringContaining("table1"));
	expect(uls[1].textContent).toEqual(expect.stringContaining("table2"));
	expect(uls[2].textContent).toEqual(expect.stringContaining("column1"));
	expect(uls[2].textContent).toEqual(expect.stringContaining("column2"));
	expect(uls[3].textContent).toEqual(expect.stringContaining("column3"));
	expect(uls[3].textContent).toEqual(expect.stringContaining("column4"));
	
});



test("If DatabaseEntityList was given a subjectTableEntity prop, the first entity in the list will be the subject table", () => {
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: [] },
		{ id: 2, name: "schema2", description: "", childEntities: [],  color: ""},
	];
	
	const subject = { id: 1, name: "subjectTable", description: "", color: "", childEntities: [] };
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			subjectTableEntity={subject}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	
	const lis = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbEntityList, "li");
	
	expect(lis.length).toBe(3);
	expect(lis[0].getAttribute("class")).toEqual(expect.stringContaining("subjectEntityRecord"));
	expect(lis[1].getAttribute("class")).not.toEqual(expect.stringContaining("subjectEntityRecord"));
	expect(lis[2].getAttribute("class")).not.toEqual(expect.stringContaining("subjectEntityRecord"));
	
});



test("DatabaseEntityList's saveDescriptionChanges will call apiAccessor.updateEntityDescription, with the right entity type name, and data", () => {
	
	const mockAPIAccessor = new MockAPIAccessor();
	mockAPIAccessor.updateEntityDescription = jest.fn();
	const changedDesc = "testNewDesc";
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: [
			{ id: 1, name: "table1", description: "", color: "", childEntities: [
				{ id: 1, name: "column1", description: "", color: "" }
			] }
		]}
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={mockAPIAccessor}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	
	const editButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "EIEditButton");
	editButtons.forEach(btn => ReactTestUtils.Simulate.click(btn));
	
	const textInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "EITextInput");
	textInputs.forEach(inp => ReactTestUtils.Simulate.change(inp, { "target": { "value": changedDesc }}));
	
	const saveButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "EISaveButton");
	saveButtons.forEach(btn => ReactTestUtils.Simulate.click(btn));
	
	//The entity type names are plural, to match the API route
	expect(mockAPIAccessor.updateEntityDescription).toHaveBeenNthCalledWith(1, "schemas", 1, changedDesc);
	expect(mockAPIAccessor.updateEntityDescription).toHaveBeenNthCalledWith(2, "tables", 1, changedDesc);
	expect(mockAPIAccessor.updateEntityDescription).toHaveBeenNthCalledWith(3, "columns", 1, changedDesc);
});
