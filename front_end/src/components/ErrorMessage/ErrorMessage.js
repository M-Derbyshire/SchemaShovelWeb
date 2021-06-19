import React, { Component } from 'react';
import './ErrorMessage.css';
import PropTypes from 'prop-types';

class ErrorMessage extends Component
{
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
	errorText: PropTypes.string.isRequired,
	closeButtonOnClick: PropTypes.func.isRequired
};

export default ErrorMessage;