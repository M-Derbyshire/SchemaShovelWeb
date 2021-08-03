import ReactTestUtils from 'react-dom/test-utils';
import DatabaseEntity from './DatabaseEntity';

const dummyDescChange = async () => {};
const dummyDescChangeErrorHandler = async () => {};

test.each([
	["testName1"],
	["testName2"]
])("DatabaseEntity will display the given name in a heading tag", (name) => {
	
	const headingTag = "h1"
	
	const dbEntity = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity
			name={name}
			description="desc"
			color="#000000"
			saveDescriptionChanges={dummyDescChange}
			saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={1000}
		 />
	);
	
	const title = ReactTestUtils.findRenderedDOMComponentWithTag(dbEntity, headingTag);
	
	expect(title.textContent).toEqual(name);
});

test.each([
	["schema1.table1"],
	["schema2.table2"]
])("DatabaseEntity will display fkToSchemaTableName prop, but won't try if none given", (fkName) => {
	
	const withFKName = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity
			fkToSchemaTableName={fkName}
			name="name"
			description="desc"
			color="#000000"
			saveDescriptionChanges={dummyDescChange}
			saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={1000}
		 />
	);
	
	const withoutFKName = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity
			name="name"
			description="desc"
			color="#000000"
			saveDescriptionChanges={dummyDescChange}
			saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={1000}
		 />
	);
	
	
	const fkToTableSpan = ReactTestUtils.findRenderedDOMComponentWithClass(withFKName, "fkToTableName");
	expect(fkToTableSpan.textContent).toEqual(fkName);
	
	const emptyFkToTableList = 
		ReactTestUtils.scryRenderedDOMComponentsWithClass(withoutFKName, "fkToTableInfo");
	expect(emptyFkToTableList.length).toEqual(0);
});

test("DatabaseEntity will display its children within li elements (within a ul)", () => {
	
	const testTexts = ["child1", "child2", "child3"];
	const spanClass = "testSpan";
	
	const dbEntity = ReactTestUtils.renderIntoDocument(
		<DatabaseEntity name="name" description="desc" color="#000000" 
			saveDescriptionChanges={dummyDescChange} saveDescriptionErrorHandler={dummyDescChangeErrorHandler}
			descriptionCharLengthLimit={1000}>
				
				{testTexts.map((child, index) => (<span className={spanClass} key={index}>{child}</span>))}
				
		</DatabaseEntity>
	);
	
	const uls = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbEntity, "ul");
	const lis = ReactTestUtils.scryRenderedDOMComponentsWithTag(dbEntity, "li");
	const spans = ReactTestUtils.scryRenderedDOMComponentsWithClass(dbEntity, spanClass);
	
	expect(uls.length).toEqual(1);
	expect(lis.length).toEqual(testTexts.length);
	expect(spans.length).toEqual(testTexts.length);
	
	for(let i = 0; i < spans.length; i++)
	{
		expect(spans[i].textContent).toEqual(testTexts[i]);
	}
});