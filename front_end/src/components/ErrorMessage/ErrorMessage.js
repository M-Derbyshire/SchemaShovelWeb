import React, { Component } from 'react';
import './ErrorMessage.css';
import PropTypes from 'prop-types';

class ErrorMessage extends Component
{
	render()
	{
		return (
			<div className="ErrorMessage">
				<span className="ErrorMessagePrefix">Error: </span>{this.props.errorText}
			</div>
		);
	}
}

ErrorMessage.propTypes = {
	errorText: PropTypes.string.isRequired
};

export default ErrorMessage;