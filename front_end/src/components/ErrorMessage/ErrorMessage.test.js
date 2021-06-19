import ErrorMessage from './ErrorMessage';
import ReactTestUtils from 'react-dom/test-utils';

test("ErrorMessage will contain the passed error text", () => {
	
	const errorText = "test error";
	
	const errorMessageComp = 
			ReactTestUtils.renderIntoDocument(<ErrorMessage errorText={errorText} closeButtonOnClick={()=>{}} />);
	const errorMessageDiv = ReactTestUtils.findRenderedDOMComponentWithTag(errorMessageComp, "div");
	
	expect(errorMessageDiv.textContent).toEqual(expect.stringContaining(errorText));
});

test("ErrorMessage close button will call the given closeButtonOnClick prop function", () => {
	
	const mockOnClick = jest.fn();
	
	const errorMessageComp = 
			ReactTestUtils.renderIntoDocument(<ErrorMessage errorText={""} closeButtonOnClick={mockOnClick} />);
	
	const closeButton = ReactTestUtils.findRenderedDOMComponentWithTag(errorMessageComp, "button");
	ReactTestUtils.Simulate.click(closeButton);
	
	expect(mockOnClick).toHaveBeenCalled();
});