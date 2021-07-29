import AnchorList from './AnchorList';
import ReactTestUtils from 'react-dom/test-utils';

test("AnchorList will generate a ul of anchors, within li elements, from the given anchor objects", () => {
	
	const testList = [
		{ label: "label1", anchor: "anchor1" },
		{ label: "label2", anchor: "anchor2" },
		{ label: "label3", anchor: "anchor3" }
	];
	
	const anchorList = ReactTestUtils.renderIntoDocument(<AnchorList anchorObjects={testList} />);
	
	const renderedUnorderedList = ReactTestUtils.findRenderedDOMComponentWithTag(anchorList, "ul");
	const renderedListItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "li");
	const renderedAnchors = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "a");
	
	expect(renderedListItems.length).toEqual(testList.length);
	expect(renderedAnchors.length).toEqual(testList.length);
	
	for(let i = 0; i < testList.length; i++)
	{
		expect(renderedAnchors[i].textContent).toEqual(testList[i].label);
		expect(renderedAnchors[i].getAttribute("href")).toEqual("#" + testList[i].anchor);
	}
});

test("AnchorList will generate an empty UL if given an empty anchor objects list", () => {
	
	const anchorList = ReactTestUtils.renderIntoDocument(<AnchorList anchorObjects={[]} />);
	
	const renderedUnorderedList = ReactTestUtils.findRenderedDOMComponentWithTag(anchorList, "ul");
	const renderedListItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "li");
	
	expect(renderedListItems.length).toEqual(0);
});