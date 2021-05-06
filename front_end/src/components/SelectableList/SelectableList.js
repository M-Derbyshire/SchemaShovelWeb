import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectableList.css';


class SelectableList extends Component
{	
	render()
	{
		return (
			<div className="SelectableList">
				<ul>
					{this.props.children.map((child, index) => {
						return (
							<li 
								key={"selectable-" + index} 
								className={(this.props.selectedItemIndex === index) ? "SelectableListItemSelected" : ""} 
								onClick={() => this.props.setSelectedItemIndex(index)}
							>
								{child}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

SelectableList.propTypes = {
	selectedItemIndex: PropTypes.number,
	setSelectedItemIndex: PropTypes.func.isRequired
}

export default SelectableList;