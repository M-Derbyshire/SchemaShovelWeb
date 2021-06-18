import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectableList.css';


class SelectableList extends Component
{	
	
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
	selectedItemIndex: PropTypes.number,
	setSelectedItemIndex: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	hasFailedToLoad: PropTypes.bool.isRequired
}

export default SelectableList;