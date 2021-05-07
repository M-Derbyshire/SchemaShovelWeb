import SelectableList from './SelectableList';
import ReactTestUtils from 'react-dom/test-utils';

const fakeSetSelected = (i) => {};

test("SelectableList will display all of its children elemenents", () => {
	
	const list = ReactTestUtils.renderIntoDocument(<SelectableList setSelectedItemIndex={fakeSetSelected}>
		<span>1</span>
		<span>2</span>
		<span>3</span>
	</SelectableList>);
	
	const spans = ReactTestUtils.scryRenderedDOMComponentsWithTag(list, "span");
	
	expect(spans.length).toBe(3);
	expect(spans[0].textContent).toBe("1");
	expect(spans[1].textContent).toBe("2");
	expect(spans[2].textContent).toBe("3");
	
});

test("SelectableList will set the selected index when an item is clicked on", () => {
	
	const mockedSetSelected = jest.fn();
	
	const list = ReactTestUtils.renderIntoDocument(<SelectableList setSelectedItemIndex={mockedSetSelected}>
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