import React, { Component } from 'react';
import './ErrorDisplay.css';

/**
* Displays its child elements as a list of errors
*
*@component
 */
class ErrorDisplay extends Component
{
	/**
	* A callback for a map function. Maps a child element into a JSX LI element
	* @param {JSX} child - The child element
	* @return {JSX} The JSX LI element, containing the child element
	 */
	childMapper(child)
	{
		return (
			<li>{child}</li>
		);
	}
	
	/** Render an ErrorDisplay */
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