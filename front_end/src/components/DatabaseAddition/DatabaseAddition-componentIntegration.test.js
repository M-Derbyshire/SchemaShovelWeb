import DatabaseAddition from './DatabaseAddition';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import { wait, waitFor } from '@testing-library/react';

test("DatabaseAddition will pass its onErrorHandler prop down to AddDatabaseForm", async () => {
	
	const mockErrorHandler = jest.fn();
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<DatabaseAddition 
				apiAccessor={new MockAPIAccessor()} 
				onErrorHandler={mockErrorHandler}
				dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	//Will cause an exception
	const fileInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "TextFileFileInput");
	const file = null; 
	ReactTestUtils.Simulate.change(fileInput, { target: { files: [file] } });
	
	await waitFor(() => expect(mockErrorHandler).toHaveBeenCalled());
	
});

test.each([
	[1],
	[2]
])("DatabaseAddition will pass its dbNameCharLimit prop down to AddDatabaseForm", async (charLimit) => {
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<DatabaseAddition 
				apiAccessor={new MockAPIAccessor()} 
				onErrorHandler={()=>{}} 
				dbNameCharLimit={charLimit} />
		</MemoryRouter>
	);
	
	const textInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	
	expect(textInput.getAttribute("maxLength")).toBe(charLimit.toString());
});


test("DatabaseAddition will call createDatabase on apiAccessor, with the set name and parsed json", async () => {
	
	const apiAccessor = new MockAPIAccessor();
	apiAccessor.createDatabase = jest.fn();
	
	const testName = "testName";
	const testJSON = '{"value":"testJSON"}';
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseAddition 
				apiAccessor={apiAccessor} 
				onErrorHandler={(e)=>{}}
				dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	const jsonInput = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "textarea");
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "form"); 
	
	ReactTestUtils.Simulate.change(nameInput, {target: {value: testName} });
	ReactTestUtils.Simulate.change(jsonInput, {target: {value: testJSON} });
	ReactTestUtils.Simulate.submit(form);
	
	await waitFor(() => expect(apiAccessor.createDatabase).toHaveBeenCalled());
	
});


test("DatabaseAddition will pass onCancelHandler to AddDatabaseForm", () => {
	
	let testHistory, testLocation;
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<DatabaseAddition 
				apiAccessor={new MockAPIAccessor()} 
				onErrorHandler={(e)=>{}} 
				dbNameCharLimit={100} />
			
			<Route path="*" render={({ history, location }) => {
				testHistory = history;
				testLocation = location;
				return null;
			}}/>
		</MemoryRouter>
	);
	
	expect(testLocation.pathname).not.toBe("/");
	
	const cancelButton = 
		ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaCancel");
	
	ReactTestUtils.Simulate.click(cancelButton);
	
	expect(testLocation.pathname).toBe("/");
	
});


test("DatabaseAddition will pass isLoading to AddDatabaseForm when awaiting apiAccessor", async () => {
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseAddition apiAccessor={undefined} onErrorHandler={(e)=>{}} dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	const forms = ReactTestUtils.scryRenderedDOMComponentsWithTag(addition, "form");
	
	expect(forms.length).toBe(0);
});


test("DatabaseAddition will pass isCreating state to AddDatabaseForm as isSaving prop", async () => {
	
	const stallingApiAccessor = new MockAPIAccessor();
	stallingApiAccessor.createDatabase = async () => {
		return {};
	};
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseAddition 
				apiAccessor={stallingApiAccessor} 
				onErrorHandler={(e)=>{}} 
				dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	const jsonInput = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "textarea");
	const submitButton = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaSubmit");
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "form"); 
	
	expect(submitButton.getAttribute("value").toLowerCase()).toEqual(expect.not.stringContaining("saving"));
	
	ReactTestUtils.Simulate.change(nameInput, {target: {value: "test"} });
	ReactTestUtils.Simulate.change(jsonInput, {target: {value: "test"} });
	ReactTestUtils.Simulate.submit(form);
	
	expect(submitButton.getAttribute("value").toLowerCase()).toEqual(expect.stringContaining("saving"));
	
}); 


test("DatabaseAddition will disable AddDatabaseForm when adding database", async () => {
	
	const stallingApiAccessor = new MockAPIAccessor();
	stallingApiAccessor.createDatabase = async () => {
		return {};
	};
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseAddition 
				apiAccessor={stallingApiAccessor} 
				onErrorHandler={(e)=>{}} 
				dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	const jsonInput = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "textarea");
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "form"); 
	
	expect(nameInput).not.toBeDisabled();
	
	ReactTestUtils.Simulate.change(nameInput, {target: {value: "test"} });
	ReactTestUtils.Simulate.change(jsonInput, {target: {value: "test"} });
	ReactTestUtils.Simulate.submit(form);
	
	expect(nameInput).toBeDisabled();
});