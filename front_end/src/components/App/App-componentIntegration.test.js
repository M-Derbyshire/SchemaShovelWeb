import App from './App';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { enableFetchMocks } from 'jest-fetch-mock'
import { waitFor } from '@testing-library/react';

enableFetchMocks();

const OLD_ENV = process.env;

beforeEach(async () => {
	fetch.resetMocks();
	jest.resetModules(); // clears the cache
	process.env.PUBLIC_URL = "http://localhost:8080";
	process.env.REACT_APP_API_BASE_URL = "http://localhost:8080/api/v1";
	process.env.REACT_APP_DB_NAME_CHAR_LIMIT = 45;
	process.env.REACT_APP_ENTITY_DESC_CHAR_LIMIT = 2000;
});

afterAll(() => {
	process.env = OLD_ENV; // Restore old environment
});




test("App will pass the apiAccessor to DatabaseAddition component", async () => {
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<App />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const forms = ReactTestUtils.scryRenderedDOMComponentsWithTag(application, "form");
		expect(forms.length).toBe(1);
	});
	
	
});


test("App will pass the onErrorHandler to DatabaseAddition component", async () => {
	
	fetch.once(() => Promise.reject(new Error("test error")));
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<App />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		
		//We don't want to see these, but the onErrorHandler logs them
		const originalConsoleError = console.error;
		console.error = jest.fn();
		
		const fileInput = ReactTestUtils.findRenderedDOMComponentWithClass(application, "TextFileFileInput");
		
		//Will cause an exception
		const file = null; 
		ReactTestUtils.Simulate.change(fileInput, { target: { files: [file] } });
		
		const errorDisplay = ReactTestUtils.findRenderedDOMComponentWithClass(application, "ErrorDisplay");
		const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "ErrorMessage");
		
		expect(errorDisplay.textContent).not.toEqual("");
		expect(errors.length).toBeGreaterThan(0);
		
		expect(console.error).toHaveBeenCalled();
		console.error = originalConsoleError;
	});
	
	
});

test("App will pass the dbNameCharLimit to the DatabaseAddition component", async () => {
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<App />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const nameInput = 
			ReactTestUtils.findRenderedDOMComponentWithClass(application, "databaseSchemaNameInput");
		
		expect(nameInput.getAttribute("maxLength")).toBe(process.env.REACT_APP_DB_NAME_CHAR_LIMIT.toString());
	});
	
	
});


//To test the character limit, the apiAccessor would have to be called anyway, so this tests both
test("App will pass the entityDescCharLimit and apiAccessor to the DatabaseViewer component", async () => {
	
	const schemaDescription = "schemaTestDescription1";
	
	const databaseData = { id: 1, name: "dbTitle", schemas: [
		{ id: 1, name: "schemaName", description: schemaDescription, color: "", tables: []}
	]};
	
	fetch.once(() => Promise.resolve(JSON.stringify(databaseData)));
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<App />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const editableItems = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "EditableItem");
	
		const editableItemsEditBtns = 
			ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "EIEditButton");
		editableItemsEditBtns.forEach((btn) => ReactTestUtils.Simulate.click(btn));
		
		const descriptionInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "EITextInput")
			.filter(inp => inp.value === schemaDescription);
		
		expect(descriptionInputs.length).toBe(1);
		expect(descriptionInputs[0].getAttribute("maxLength")).toBe(process.env.REACT_APP_ENTITY_DESC_CHAR_LIMIT.toString());
	});
	
});



//To test the character limit, the apiAccessor would have to be called anyway, so this tests both
test("App will pass the entityDescCharLimit and apiAccessor to the DatabaseSelection component", async () => {
	
	const dbTitle = "dbTestName1";
	
	const databaseData = [{ id: 1, name: dbTitle }];
	
	fetch.once(() => Promise.resolve(JSON.stringify(databaseData)));
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/"]}>
			<App />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const editableItems = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "EditableItem");
		
		const editableItemsEditBtns = 
			ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "EIEditButton");
		editableItemsEditBtns.forEach((btn) => ReactTestUtils.Simulate.click(btn));
		
		const nameInputs = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "EITextInput")
			.filter(inp => inp.value === dbTitle);
		
		expect(nameInputs.length).toBe(1);
		expect(nameInputs[0].getAttribute("maxLength")).toBe(process.env.REACT_APP_DB_NAME_CHAR_LIMIT.toString());
	});
	
});