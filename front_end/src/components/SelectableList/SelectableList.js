import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectableList.css';


class SelectableList extends Component
{	
	
	childMapper(child, index)
	{
		return (
			<li 
				key={"selectable-" + index} 
				className={(this.props.selectedItemIndex === index) ? "SelectableItemSelected" : ""} 
				onClick={() => this.props.setSelectedItemIndex(index)}>
			{child}
			</li>
		);
	}
	
	render()
	{
		const listContent = (!this.props.isLoading) ? 
			this.props.children.map(this.childMapper.bind(this)) : 
			(<li className="loadingText" key={0}>Loading...</li>)
		
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
	selectedItemIndex: PropTypes.number,
	setSelectedItemIndex: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired
}

export default SelectableList;