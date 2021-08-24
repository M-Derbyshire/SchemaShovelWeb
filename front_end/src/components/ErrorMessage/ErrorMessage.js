import React, { Component } from 'react';
import './ErrorMessage.css';
import PropTypes from 'prop-types';

/**
* Displays the given error message text, and provides a button for dismissing the error
*
*@component
 */
class ErrorMessage extends Component
{
	/** Renders an ErrorMessage */
	render()
	{
		return (
			<div className="ErrorMessage">
				<button className="ErrorMessageCloseBtn" onClick={this.props.closeButtonOnClick}>x</button>
				<span className="ErrorMessagePrefix">Error: </span>{this.props.errorText}
			</div>
		);
	}
}

ErrorMessage.propTypes = {
	/**
	* The error text to be displayed
	 */
	errorText: PropTypes.string.isRequired,
	
	/**
	* A function that will dismiss this error.
	 */
	closeButtonOnClick: PropTypes.func.isRequired
};

export default ErrorMessage;