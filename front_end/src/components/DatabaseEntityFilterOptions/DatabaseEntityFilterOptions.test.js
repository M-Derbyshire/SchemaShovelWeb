import ReactTestUtils from 'react-dom/test-utils';
import DatabaseEntityFilterOptions from './DatabaseEntityFilterOptions';

const dummyFuncProp = () => {};
const bareTestSchemas = [
	{ id: 1, name: "aSchema", childEntities: [
		{ id: 1, name: "aTable", childEntities: [
			{ id: 1, name: "aColumn" }
		]}
	]},
	{ id: 2, name: "aSchema", childEntities: [
		{ id: 2, name: "aTable", childEntities: [
			{ id: 2, name: "aColumn" }
		]}
	]}
];

test("using the text-filter clear button will clear the filters (but not the description checkbox)", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions schemas={[]} runTextFilter={dummyFuncProp} runFkFilter={dummyFuncProp} />
	);
	
	const filterInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "textFilterInput");
	const descCheckbox = ReactTestUtils.findRenderedDOMComponentWithClass(options, "descFilterCheckbox");
	const clearFilterBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "textFilterClearBtn");
	
	filterInputs.forEach(fi => ReactTestUtils.Simulate.change(fi, { target: { value: 'testing' } }));
	ReactTestUtils.Simulate.change(descCheckbox, { target: { checked: true } });
	ReactTestUtils.Simulate.click(clearFilterBtn);
	
	filterInputs.forEach(fi => expect(fi.value).toEqual(""));
	expect(descCheckbox.checked).toBeTruthy();
});


test.each([
	[true],
	[false]
])("the text-filter clear button will call the runTextFilter prop with empty strings, but with the right description checkbox value", (checkCheckbox) => {
	
	const mockRunTextFilter = jest.fn();
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={[]} runTextFilter={mockRunTextFilter} runFkFilter={dummyFuncProp} />
	);
	const descCheckbox = ReactTestUtils.findRenderedDOMComponentWithClass(options, "descFilterCheckbox");
	const clearFilterBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "textFilterClearBtn");
	
	ReactTestUtils.Simulate.change(descCheckbox, { target: { checked: checkCheckbox } });
	ReactTestUtils.Simulate.click(clearFilterBtn);
	
	expect(mockRunTextFilter).toHaveBeenCalledWith("", "", "", checkCheckbox);
	
});


test.each([
	[["schemaTest1", "tableTest1", "columnTest1"], true],
	[["schemaTest2", "tableTest2", "columnTest2"], false]
])("the text-filter filter button will call the runTextFilter prop function, with the given values", 
	(filterTextValues, checkCheckbox) => {
	
	const mockRunTextFilter = jest.fn();
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={[]} runTextFilter={mockRunTextFilter} runFkFilter={dummyFuncProp} />
	);
	
	const filterInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "textFilterInput");
	const descCheckbox = ReactTestUtils.findRenderedDOMComponentWithClass(options, "descFilterCheckbox");
	const runFilterBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "textFilterRunBtn");
	
	expect(filterInputs.length).toEqual(filterTextValues.length);
	filterInputs.forEach((fi, index) => {
		ReactTestUtils.Simulate.change(fi, { target: { value: filterTextValues[index] } });
	});
	
	ReactTestUtils.Simulate.change(descCheckbox, { target: { checked: checkCheckbox } });
	ReactTestUtils.Simulate.click(runFilterBtn);
	
	expect(mockRunTextFilter).toHaveBeenCalledWith.apply(this, [...filterTextValues, checkCheckbox]);
	
});


test("using the fk-filter clear button will clear the lists back to -1", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={dummyFuncProp} />
	);
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	const clearBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkFilterClearBtn");
	
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.click(clearBtn);
	
	expect(schemaSelect.value).toEqual("-1");
	expect(tableSelect.value).toEqual("-1");
});


test("the fk-filter clear button will call the runFKFilter prop with -1 as the passed id", () => {
	
	const mockRunFkFilter = jest.fn();
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={mockRunFkFilter} />
	);
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	const clearBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkFilterClearBtn");
	
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.click(clearBtn);
	
	expect(mockRunFkFilter).toHaveBeenCalledWith(-1);
});

// looking at bareTestSchemas at the top of this file, each tableID is the same as it's schemaID, 
//so these represent both
test.each([
	[1],
	[2]
])("the fk-filter filter button will call the runFKFilter prop function, with the selected table ID", (schemaAndTableID) => {
	
	const mockRunFkFilter = jest.fn();
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={mockRunFkFilter} />
	);
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	const runBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkFilterRunBtn");
	
	// looking at bareTestSchemas at the top of this file, each tableID is the same as it's schemaID, 
	//so using the same variable
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: schemaAndTableID } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: schemaAndTableID } });
	ReactTestUtils.Simulate.click(runBtn);
	
	expect(mockRunFkFilter).toHaveBeenCalledWith(schemaAndTableID);
	
});


test("the initial values of the fk-filter schema and table selects will be -1", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={dummyFuncProp} />
	);
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	
	expect(schemaSelect.value).toEqual("-1");
	expect(tableSelect.value).toEqual("-1");
});


test("if there is no table selected for the fk-filter, the fk filter button will be disabled", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={dummyFuncProp} />
	);
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	const runBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkFilterRunBtn");
	
	expect(runBtn).toBeDisabled();
	
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: 1 } });
	expect(runBtn).toBeDisabled();
	
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: 1 } });
	expect(runBtn).not.toBeDisabled();
});


test("the run text-filter button will clear the fk filter selects", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={dummyFuncProp} />
	);
	
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	const runTxtFilterBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "textFilterRunBtn");
	
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.click(runTxtFilterBtn);
	
	expect(schemaSelect.value).toEqual("-1");
	expect(tableSelect.value).toEqual("-1");
});


test("the run fk-filter button will clear the text-filter inputs", () => {
	
	const options = ReactTestUtils.renderIntoDocument(
		<DatabaseEntityFilterOptions 
			schemas={bareTestSchemas} runTextFilter={dummyFuncProp} runFkFilter={dummyFuncProp} />
	);
	
	const filterInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(options, "textFilterInput");
	const runFKFilterBtn = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkFilterRunBtn");
	const schemaSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkSchemaSelect");
	const tableSelect = ReactTestUtils.findRenderedDOMComponentWithClass(options, "fkTableSelect");
	
	filterInputs.forEach((fi) => {
		ReactTestUtils.Simulate.change(fi, { target: { value: "test1" } });
	});
	
	//Need to set these, to enable the run button for the fk filter
	ReactTestUtils.Simulate.change(schemaSelect, { target: { value: "1" } });
	ReactTestUtils.Simulate.change(tableSelect, { target: { value: "1" } });
	
	ReactTestUtils.Simulate.click(runFKFilterBtn);
	
	filterInputs.forEach(fi => expect(fi.value).toEqual(""));
});