import DatabaseAddition from './DatabaseAddition';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import sleep from '../testingHelpers/sleepFunc';


test("onCancelHandler will redirect to root", () => {
	
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


test("databaseAdditionHandler will call createDatabase on apiAccessor, with the set name and parsed json", async () => {
	
	const apiAccessor = new MockAPIAccessor();
	apiAccessor.createDatabase = jest.fn();
	
	const testName = "testName";
	const testJSON = '{"value":"testJSON"}';
	const expectedObject = `{"name":"${testName}","schemas":${testJSON}}`;
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseAddition apiAccessor={apiAccessor} onErrorHandler={(e)=>{}} dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	const jsonInput = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "textarea");
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "form"); 
	
	ReactTestUtils.Simulate.change(nameInput, {target: {value: testName} });
	ReactTestUtils.Simulate.change(jsonInput, {target: {value: testJSON} });
	ReactTestUtils.Simulate.submit(form);
	
	await sleep(100); //We're waiting on an asynchronous operation
	
	expect(apiAccessor.createDatabase).toHaveBeenCalledWith(expectedObject);
});


test("databaseAdditionHandler will catch any exceptions thrown by apiAccessor.createDatabase()", async () => {
	
	//can't use expect().toThrow(), due to the asynchronous nature of what we're doing
	//Will just be an unhandled promise exception if the test fails, unfortunately
	
	const apiAccessor = new MockAPIAccessor();
	apiAccessor.throwOnNextRequest();
	
	const testName = "testName";
	const testJSON = '{"value":"testJSON"}';
	
	const addition = ReactTestUtils.renderIntoDocument(
		<MemoryRouter>
			<DatabaseAddition apiAccessor={apiAccessor} onErrorHandler={(e)=>{}} dbNameCharLimit={100} />
		</MemoryRouter>
	);
	
	const nameInput = ReactTestUtils.findRenderedDOMComponentWithClass(addition, "databaseSchemaNameInput");
	const jsonInput = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "textarea");
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "form"); 
	
	ReactTestUtils.Simulate.change(nameInput, {target: {value: testName} });
	ReactTestUtils.Simulate.change(jsonInput, {target: {value: testJSON} });
	ReactTestUtils.Simulate.submit(form);
	
	await sleep(100); //We're waiting on an asynchronous operation
	
	expect(1).toBe(1);
});


test("databaseAdditionHandler will redirect to root when finished", async () => {
	
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
	
	const form = ReactTestUtils.findRenderedDOMComponentWithTag(addition, "form"); 
	ReactTestUtils.Simulate.submit(form);
	await sleep(100);
	
	expect(testLocation.pathname).toBe("/");
	
});