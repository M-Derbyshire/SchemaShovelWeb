import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectableList.css';

/**
* Lists its child elements in a UL element. It also allows you to select elements (only one element can be 
* selected at a time). This can also display a loading message, or an error message.
*
*@component
 */
class SelectableList extends Component
{	
	/**
	* This is the callback for a map function. This maps the given child element into a JSX LI element
	* @param {JSX} child - The child element to be mapped
	* @param {number} index - The index of the child in its respective array
	 */
	childMapper(child, index)
	{
		return (
			<li 
				className={(this.props.selectedItemIndex === index) ? "SelectableItemSelected" : ""} 
				onClick={() => this.props.setSelectedItemIndex(index)}>
			{child}
			</li>
		);
	}
	
	/** Render a selectable list */
	render()
	{
		let listContent;
		
		if(this.props.hasFailedToLoad)
		{
			listContent = (<li className="infoText" key={0}>An error has occurred.</li>);
		}
		else if(this.props.isLoading)
		{
			listContent = (<li className="infoText" key={0}>Loading...</li>);
		}
		else
		{
			listContent = React.Children.map(this.props.children, this.childMapper.bind(this));
		}
		
		
		return (
			<div className="SelectableList">
				<ul>
					{listContent}
				</ul>
			</div>
		);
	}
}

SelectableList.propTypes = {
	/**
	* The array index of the selected item in the child array
	 */
	selectedItemIndex: PropTypes.number,
	
	/**
	* A function that sets the selected index
	* @param {number} index - The index of the newly selected item
	 */
	setSelectedItemIndex: PropTypes.func.isRequired,
	
	/**
	* Is the application still loading something that is required to generate this list?
	 */
	isLoading: PropTypes.bool.isRequired,
	
	/**
	* Has this application failed to load something that is critical to generating this list?
	 */
	hasFailedToLoad: PropTypes.bool.isRequired
}

export default SelectableList;