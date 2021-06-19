import ErrorDisplay from './ErrorDisplay';
import ReactTestUtils from 'react-dom/test-utils';

test("ErrorDisplay will display its children in a list", () => {
	
	const errorDisplay = ReactTestUtils.renderIntoDocument(
		<ErrorDisplay>
			<span>test 1</span>
			<span>test 2</span>
			<span>test 3</span>
		</ErrorDisplay>
	);
	
	const liItems = ReactTestUtils.scryRenderedDOMComponentsWithTag(errorDisplay, "li");
	
	expect(liItems[0].textContent).toBe("test 1");
	expect(liItems[1].textContent).toBe("test 2");
	expect(liItems[2].textContent).toBe("test 3");
});