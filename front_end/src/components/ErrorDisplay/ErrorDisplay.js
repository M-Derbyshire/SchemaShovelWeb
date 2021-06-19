import React, { Component } from 'react';
import './ErrorDisplay.css';

class ErrorDisplay extends Component
{
	childMapper(child)
	{
		return (
			<li>{child}</li>
		);
	}
	
	render()
	{
		return (
			<div className="ErrorDisplay">
				<ul>
					{React.Children.map(this.props.children, this.childMapper.bind(this))}
				</ul>
			</div>
		);
	}
}

export default ErrorDisplay;