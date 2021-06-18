import SelectableList from './SelectableList';
import ReactTestUtils from 'react-dom/test-utils';

const fakeSetSelected = (i) => {};

test("SelectableList will display all of its children elemenents, when not loading, but not the loading text", () => {
	
	const list = ReactTestUtils.renderIntoDocument(<SelectableList 
			setSelectedItemIndex={fakeSetSelected} 
			isLoading={false}
			hasFailedToLoad={false}>
		<span>1</span>
		<span>2</span>
		<span>3</span>
	</SelectableList>);
	
	
	const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(list, "span");
	
	expect(spans.length).toBe(3);
	expect(spans[0].textContent).toBe("1");
	expect(spans[1].textContent).toBe("2");
	expect(spans[2].textContent).toBe("3");
	
	expect(spans[0].textContent.toLowerCase()).toEqual(expect.not.stringContaining("loading"));
	expect(spans[1].textContent.toLowerCase()).toEqual(expect.not.stringContaining("loading"));
	expect(spans[2].textContent.toLowerCase()).toEqual(expect.not.stringContaining("loading"));
});

test("SelectableList will display a span with loading text, but not the children, when isLoading prop is true", () => {
	
	const list = ReactTestUtils.renderIntoDocument(<SelectableList setSelectedItemIndex={fakeSetSelected} 
			isLoading={true} hasFailedToLoad={false}>
		<span>1</span>
		<span>2</span>
		<span>3</span>
	</SelectableList>);
	
	const li = ReactTestUtils.findRenderedDOMComponentWithTag(list, "li");
	const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(list, "span");
	
	expect(spans.length).toBe(0);
	expect(li.textContent.toLowerCase()).toEqual(expect.stringContaining("loading"));
});

test("SelectableList will display a span with error text, but not the children, when hasFailedToLoad prop is true", () => {
	
	const list = ReactTestUtils.renderIntoDocument(<SelectableList setSelectedItemIndex={fakeSetSelected} 
			isLoading={false} hasFailedToLoad={true}>
		<span>1</span>
		<span>2</span>
		<span>3</span>
	</SelectableList>);
	
	const li = ReactTestUtils.findRenderedDOMComponentWithTag(list, "li");
	const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(list, "span");
	
	expect(spans.length).toBe(0);
	expect(li.textContent.toLowerCase()).toEqual(expect.stringContaining("an error has occurred"));
});

test("SelectableList will set the selected index when an item is clicked on", () => {
	
	const mockedSetSelected = jest.fn();
	
	const list = ReactTestUtils.renderIntoDocument(<SelectableList 
			setSelectedItemIndex={mockedSetSelected} 
			isLoading={false}
			hasFailedToLoad={false}>
		<span>1</span>
		<span>2</span>
		<span>3</span>
	</SelectableList>);
	
	const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(list, "span");
	
	for(let i = 0; i < 3; i++)
	{
		ReactTestUtils.Simulate.click(spans[i]);
	}
	
	expect(mockedSetSelected).toHaveBeenNthCalledWith(1, 0);
	expect(mockedSetSelected).toHaveBeenNthCalledWith(2, 1);
	expect(mockedSetSelected).toHaveBeenNthCalledWith(3, 2);
	
});	