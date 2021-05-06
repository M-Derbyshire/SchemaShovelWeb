import React, { Component } from 'react';
import './SelectableList.css';


class SelectableList extends Component
{
	
	constructor(props)
	{
		super(props);
		this.state = { selectedIndex: 0 };
	}
	
	selectItem(itemIndex)
	{
		if(this.state.selectedIndex !== itemIndex)
		{
			this.setState({
				selectedIndex: itemIndex
			});
		}
	}
	
	render()
	{
		return (
			<div className="SelectableList">
				<ul>
					{this.props.children.map((child, index) => {
						return (
							<li 
								key={"selectable-" + index} 
								className={(this.state.selectedIndex === index) ? "SelectableListItemSelected" : ""} 
								onClick={() => this.selectItem(index)}
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

export default SelectableList;