import ErrorMessage from './ErrorMessage';
import ReactTestUtils from 'react-dom/test-utils';

test("Error message will contain the passed error text", () => {
	
	const errorText = "test error";
	
	const errorMessageComp = ReactTestUtils.renderIntoDocument(<ErrorMessage errorText={errorText} />);
	const errorMessageDiv = ReactTestUtils.findRenderedDOMComponentWithTag(errorMessageComp, "div");
	
	expect(errorMessageDiv.textContent).toEqual(expect.stringContaining(errorText));
});