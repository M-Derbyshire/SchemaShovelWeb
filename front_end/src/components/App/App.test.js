import App from './App';
import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import sleep from '../testingHelpers/sleepFunc';
import { enableFetchMocks } from 'jest-fetch-mock'

enableFetchMocks();

const OLD_ENV = process.env;
const originalConsoleError = console.error;

beforeEach(async () => {
	fetch.resetMocks();
	jest.resetModules(); // clears the cache
	process.env.PUBLIC_URL = "http://localhost:8080";
	console.error = jest.fn();
});

afterAll(() => {
	process.env = OLD_ENV; // Restore old environment
	console.error = originalConsoleError;
});

test("When at the create route, App will render a DatabaseAddition component", () => {
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/create"]}>
			<App />
		</MemoryRouter>
	);
	
	const databaseAdditions = 
		ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "DatabaseAddition");
	
	expect(databaseAdditions.length).toBe(1);
});

test.each([
	[1],
	[2],
	[3]
])("When at a view route, App will render a DatabaseViewer component", (id) => {
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={[`/view/${id}`]}>
			<App />
		</MemoryRouter>
	);
	
	const databaseViewers = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "DatabaseViewer");
	
	expect(databaseViewers.length).toBe(1);
});

test.each([
	["/"],
	["/test"],
	["/djkashakjshd/hdsahdahs"]
])("When at the / (root) route, or any route that isn't otherwise used, the App will render a DatabaseSelection", (route) => {
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={[route]}>
			<App />
		</MemoryRouter>
	);
	
	const databaseSelections = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "DatabaseSelection");
	
	expect(databaseSelections.length).toBe(1);
	
});

test.each([
	["/"],
	["/create"],
	["/view/1"],
	["/djkashakjshd/hdsahdahs"]
])("When at any route, App will render an ErrorDisplay", (route) => {
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={[route]}>
			<App />
		</MemoryRouter>
	);
	
	const errorDisplays = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "ErrorDisplay");
	
	expect(errorDisplays.length).toBe(1);
	
});

test("App will map ErrorMessage objects (from onErrorHandler) for errors into ErrorDisplay", async () => {
	
	const errorText = "test error";
	
	fetch.mockResponseOnce(() => Promise.reject(new Error(errorText)));
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/"]}>
			<App />
		</MemoryRouter>
	);
	
	await sleep(100); //Awaiting loading of settings (which will fail)
	
	const errorDisplay = ReactTestUtils.findRenderedDOMComponentWithClass(application, "ErrorDisplay");
	const errors = ReactTestUtils.scryRenderedDOMComponentsWithClass(application, "ErrorMessage");
	
	expect(errorDisplay.textContent).toEqual(expect.stringContaining(errorText));
	expect(errors.length).toBe(1);
	expect(errors[0].textContent).toEqual(expect.stringContaining(errorText));
});

test("App's onErrorHandler will console.error the errors", async () => {
	
	const errorText = "test error";
	
	fetch.mockResponseOnce(() => Promise.reject(new Error(errorText)));
	
	const application = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/"]}>
			<App />
		</MemoryRouter>
	);
	
	await sleep(100); //Awaiting loading of settings (which will fail)
	
	expect(console.error).toHaveBeenCalledWith(expect.stringContaining(errorText));
});