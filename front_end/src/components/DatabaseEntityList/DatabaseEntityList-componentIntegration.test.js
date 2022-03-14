import ReactTestUtils from 'react-dom/test-utils';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import EntityElementIdGenerator from '../../EntityElementIdGenerator/EntityElementIdGenerator';
import DatabaseEntityList from './DatabaseEntityList';

test("DatabaseEntityList will use an EntityElementIdGenerator to create the element IDs for the DatabaseEntity components", () => {
	
	const idGenerator = new EntityElementIdGenerator();
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: [
			{ id: 1, name: "table1", description: "", color: "", childEntities: [
				{ id: 1, name: "column1", description: "", color: "" }
			] }
		]}
	];
	
	const schemaID = idGenerator.getIdForSchema(entities[0].id, entities[0].name);
	const tableID = 
		idGenerator.getIdForTable(entities[0].childEntities[0].id, entities[0].childEntities[0].name);
	const columnID = idGenerator.getIdForColumn(
		entities[0].childEntities[0].childEntities[0].id, 
		entities[0].childEntities[0].childEntities[0].name
	);
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	
	const dbEntities = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "DatabaseEntity");
	
	expect(dbEntities.length).toBe(3);
	expect(dbEntities[0].getAttribute("id")).toEqual(schemaID);
	expect(dbEntities[1].getAttribute("id")).toEqual(tableID);
	expect(dbEntities[2].getAttribute("id")).toEqual(columnID);
	
});



test("DatabaseEntityList will generate a table-specific element ID from EntityElementIdGenerator for the fk filter subject table", () => {
	
	const idGenerator = new EntityElementIdGenerator();
	
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
	
	const tableID = idGenerator.getIdForTable(subject.id, subject.name);
	
	const dbEntities = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "DatabaseEntity");
	
	expect(dbEntities[0].getAttribute("id")).toEqual(tableID);
	
});



test.each([
	["schema1", "table1", "column1"],
	["schema2", "table2", "column2"],
	["schema3", "table3", "column3"]
])("DatabaseEntityList will pass the entity name to DatabaseEntity components", (schemaName, tableName, columnName) => {
	
	const entities = [
		{ id: 1, name: schemaName, description: "", color: "", childEntities: [
			{ id: 1, name: tableName, description: "", color: "", childEntities: [
				{ id: 1, name: columnName, description: "", color: "" }
			] }
		]}
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	const dbEntityNames = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "dbEntityName");
	
	expect(dbEntityNames[0].textContent).toEqual(expect.stringContaining(schemaName));
	expect(dbEntityNames[1].textContent).toEqual(expect.stringContaining(tableName));
	expect(dbEntityNames[2].textContent).toEqual(expect.stringContaining(columnName));
});



test.each([
	["schema1", "table1", "column1"],
	["schema2", "table2", "column2"],
	["schema3", "table3", "column3"]
])("DatabaseEntityList will pass the entity description to DatabaseEntity components", (schemaDesc, tableDesc, columnDesc) => {
	
	const entities = [
		{ id: 1, name: "", description: schemaDesc, color: "", childEntities: [
			{ id: 1, name: "", description: tableDesc, color: "", childEntities: [
				{ id: 1, name: "", description: columnDesc, color: "" }
			] }
		]}
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	const dbEntityDescriptions = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "EditableItem");
	
	expect(dbEntityDescriptions[0].textContent).toEqual(expect.stringContaining(schemaDesc));
	expect(dbEntityDescriptions[1].textContent).toEqual(expect.stringContaining(tableDesc));
	expect(dbEntityDescriptions[2].textContent).toEqual(expect.stringContaining(columnDesc));
});



test("DatabaseEntityList will pass the entity fkToSchemaTableName to DatabaseEntity components, if the table ID is found", () => {
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: [
			{ id: 1, name: "", description: "", color: "", childEntities: [
				{ id: 1, name: "", description: "", color: "", fkToTableId: 2 }
			] },
			{ id: 2, name: "table2", description: "", color: "", childEntities: [] }
		]}
	];
	
	const tableLabels = [
		{ entityID: 2, label: "schema1.table2" }
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={tableLabels}
			entityDescCharLimit={1} />
	);
	
	const fkSchemaTableNames = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntityList, "fkToTableName");
	
	expect(fkSchemaTableNames.textContent).toEqual(expect.stringContaining(tableLabels[0].label));
});



test("DatabaseEntityList will pass a 'not found' message as the fkToSchemaTableName prop to DatabaseEntity components, if the table ID is not found", () => {
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: [
			{ id: 1, name: "table1", description: "", color: "", childEntities: [
				{ id: 1, name: "column1", description: "", color: "", fkToTableId: 2 }
			] },
			{ id: 2, name: "table2", description: "", color: "", childEntities: [] }
		]}
	];
	
	const tableLabels = [
		{ entityID: 1, label: "schema1.table1" }
		//None for table 2 (which is the target of the FK)
	];
	
	const notFoundMessage = "Unable to identify table.";
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={tableLabels}
			entityDescCharLimit={1} />
	);
	
	const fkSchemaTableNames = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntityList, "fkToTableName");
	
	expect(fkSchemaTableNames.textContent).toEqual(expect.stringContaining(notFoundMessage));
});



test("DatabaseEntityList will pass the saveDescriptionChanges function -- which calls apiAccessor.updateEntityDescription -- to DatabaseEntity components", () => {
	
	const mockAPIAccessor = new MockAPIAccessor();
	mockAPIAccessor.updateEntityDescription = jest.fn();
	const changedDesc = "testNewDesc";
	
	const entities = [
		{ id: 1, name: "schema1", description: "", color: "", childEntities: []}
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={mockAPIAccessor}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={1} />
	);
	
	
	const editButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntityList, "EIEditButton");
	ReactTestUtils.Simulate.click(editButton);
	
	//Edit the text
	const textInput = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntityList, "EITextInput");
	ReactTestUtils.Simulate.change(textInput, { "target": { "value": changedDesc }});
	
	//Click save
	const saveButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbEntityList, "EISaveButton");
	ReactTestUtils.Simulate.click(saveButton);
	
	expect(mockAPIAccessor.updateEntityDescription).toHaveBeenCalled();
});



test.each([
	[1],
	[2],
	[3]
])("DatabaseEntityList will pass the descriptionCharLengthLimit prop on to DatabaseEntity components", (charLimit) => {
	
	const entities = [
		{ id: 1, name: "schemaName", description: "", color: "", childEntities: [
			{ id: 1, name: "tableName", description: "", color: "", childEntities: [
				{ id: 1, name: "columnName", description: "", color: "" }
			] }
		]}
	];
	
	const dbEntityList = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityList
			apiAccessor={new MockAPIAccessor()}
			entityList={entities}
			tableLabels={[]}
			entityDescCharLimit={charLimit} />
	);
	
	const editButtons = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "EIEditButton");
	editButtons.forEach(btn => ReactTestUtils.Simulate.click(btn));
	
	const textInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntityList, "EITextInput");
	
	textInputs.forEach(txtIn => expect(txtIn.getAttribute("maxLength")).toEqual(charLimit.toString()));
});