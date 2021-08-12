import AnchorList from './AnchorList';
import ReactTestUtils from 'react-dom/test-utils';

test("AnchorList will generate a ul of anchors, within li elements, from the given anchor objects", () => {
	
	const testList = [
		{ label: "label1", anchor: "anchor1", isMatch: false },
		{ label: "label2", anchor: "anchor2", isMatch: false },
		{ label: "label3", anchor: "anchor3", isMatch: true }
	];
	
	const anchorList = ReactTestUtils.renderIntoDocument(<AnchorList anchorObjects={testList} />);
	
	const renderedUnorderedList = ReactTestUtils.findRenderedDOMComponentWithTag(anchorList, "ul");
	const renderedListItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "li");
	const renderedAnchors = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "a");
	
	expect(renderedListItems.length).toEqual(testList.length);
	expect(renderedAnchors.length).toEqual(testList.length);
	
	for(let i = 0; i < testList.length; i++)
	{
		const expectedLabel = 
			(testList[i].isMatch) ? expect.stringContaining(testList[i].label) : testList[i].label;
		
		expect(renderedAnchors[i].textContent).toEqual(expectedLabel);
		expect(renderedAnchors[i].getAttribute("href")).toEqual("#" + testList[i].anchor);
	}
});

test("AnchorList will generate an empty UL if given an empty anchor objects list", () => {
	
	const anchorList = ReactTestUtils.renderIntoDocument(<AnchorList anchorObjects={[]} />);
	
	const renderedUnorderedList = ReactTestUtils.findRenderedDOMComponentWithTag(anchorList, "ul");
	const renderedListItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "li");
	
	expect(renderedListItems.length).toEqual(0);
});

test("AnchorList will add text before the anchor's label, only if isMatch is true for that anchor", () => {
	
	const anchorList = ReactTestUtils.renderIntoDocument(<AnchorList anchorObjects={[
		{ label: "test1", anchor: "test1", isMatch: true },
		{ label: "test2", anchor: "test2", isMatch: true },
		{ label: "test3", anchor: "test3", isMatch: false }
	]} />);
	
	const isMatchSpans = ReactTestUtils.scryRenderedDOMComponentsWithClass(anchorList, "anchorIsMatchText");
	const lis = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "li");
	
	expect(isMatchSpans.length).toBe(2);
	expect(lis[0].textContent.toLowerCase()).toEqual(expect.stringContaining("match"));
	expect(lis[1].textContent.toLowerCase()).toEqual(expect.stringContaining("match"));
	expect(lis[2].textContent.toLowerCase()).toEqual(expect.not.stringContaining("match"));
});

test("AnchorList will add the anchor for a specific table to the list, if it is given as the fkSubjectTable prop", () => {
	
	const anchorObjects = [
		{ label: "test1", anchor: "test1", isMatch: false },
		{ label: "test2", anchor: "test2", isMatch: false },
		{ label: "test3", anchor: "test3", isMatch: false }
	];
	
	const fkSubjectTable = { label: "subject", anchor: "subject", isMatch: false };
	
	const anchorList = ReactTestUtils.renderIntoDocument(
		<AnchorList anchorObjects={anchorObjects} fkSubjectTable={fkSubjectTable} />
	);
	
	
	const lis = ReactTestUtils.scryRenderedDOMComponentsWithTag(anchorList, "li");
	const subjects = ReactTestUtils.scryRenderedDOMComponentsWithClass(anchorList, "fkSubjectAnchor")
	
	expect(subjects.length).toBe(1);
	expect(lis.length).toBe(anchorObjects.length + 1);
	expect(lis[0].textContent.toLowerCase()).toEqual(expect.stringContaining(fkSubjectTable.label));
	expect(lis[1].textContent.toLowerCase()).toEqual(expect.stringContaining(anchorObjects[0].label));
	expect(lis[2].textContent.toLowerCase()).toEqual(expect.stringContaining(anchorObjects[1].label));
	expect(lis[3].textContent.toLowerCase()).toEqual(expect.stringContaining(anchorObjects[2].label));
});