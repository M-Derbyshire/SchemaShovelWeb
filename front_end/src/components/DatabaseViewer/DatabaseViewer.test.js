import ReactTestUtils from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import MockAPIAccessor from '../testingHelpers/MockAPIAccessor';
import DatabaseViewer from './DatabaseViewer';

test("DatabaseViewer's main menu button will take you back to the root route", () => {
	
	let testHistory, testLocation;
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer entityDescCharLimit={1} />
			
			<Route path="*" render={({ history, location }) => {
				testHistory = history;
				testLocation = location;
				return null;
			}}/>
		</MemoryRouter>
	);
	
	const menuButton = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "dbViewerMenuBtn");
	ReactTestUtils.Simulate.click(menuButton);
	
	expect(testLocation.pathname).toEqual("/");
});




test("DatabaseViewer's title will be a loading message, when the component first mounts", () => {
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	const titleElem = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "dbViewerTitle");
	
	expect(titleElem.textContent.toLowerCase()).toEqual(expect.stringContaining("loading"));
});

test("DatabaseViewer's title will become an error message, if apiAccessor gives an error", async () => {
	
	const mockAPIAccessor = new MockAPIAccessor();
	mockAPIAccessor.throwOnNextRequest();
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const titleElem = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "dbViewerTitle");
		expect(titleElem.textContent.toLowerCase()).toEqual(expect.stringContaining("error"));
	});
	
});

test("DatabaseViewer's title will become the database name, if apiAccessor returns it", async () => {
	
	const name = "test1name";
	
	const mockAPIAccessor = new MockAPIAccessor([{ id: 1, name, schemas: [] }]);
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	await waitFor(() => {
		const titleElem = ReactTestUtils.findRenderedDOMComponentWithClass(dbViewer, "dbViewerTitle");
		expect(titleElem.textContent.toLowerCase()).toEqual(expect.stringContaining(name));
	});
	
});



test.each([
	[1],
	[2],
	[3]
])("DatabaseViewer will make a request to apiAccessor with the id in the url", (id) => {
	
	const mockAPIAccessor = new MockAPIAccessor();
	mockAPIAccessor.getDatabaseByID = 
		jest.fn().mockResolvedValue([{ id, name: "test1", schemas: [] }]);
	
	delete window.location;
	window.location = new URL(`http://mydomain.com/view/${id}`);
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={[`/view/${id}`]}>
			<DatabaseViewer apiAccessor={mockAPIAccessor} entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	expect(mockAPIAccessor.getDatabaseByID).toHaveBeenCalledWith(id);
});



test("DatabaseViewer will render a DatabaseEntityFilterOptions", () => {
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	const filterOptions = 
		ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "DatabaseEntityFilterOptions");
	
	expect(filterOptions.length).toBe(1);
});

test("DatabaseViewer will render an AnchorList", () => {
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	const anchorLists = 
		ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "AnchorList");
	
	expect(anchorLists.length).toBe(1);
});

test("DatabaseViewer will render a DatabaseEntityList", () => {
	
	const dbViewer = ReactTestUtils.renderIntoDocument(
		<MemoryRouter initialEntries={["/view/1"]}>
			<DatabaseViewer entityDescCharLimit={1} />
		</MemoryRouter>
	);
	
	const entityLists = 
		ReactTestUtils.scryRenderedDOMComponentsWithClass(dbViewer, "DatabaseEntityList");
	
	expect(entityLists.length).toBe(1);
});