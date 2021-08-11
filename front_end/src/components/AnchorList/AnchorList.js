import React, { Component } from 'react';
import './AnchorList.css';
import PropTypes from 'prop-types';

class AnchorList extends Component
{
	constructor(props)
	{
		super(props);
	}
	
	mapAnchorListToElements()
	{
		return this.props.anchorObjects.map(
			(anchor) => (
				<li key={`${anchor.anchor}`}>
				<a href={"#" + anchor.anchor}>
					{anchor.isMatch && <span className="anchorIsMatchText">(Match) </span>}
					{anchor.label}
				</a></li>
			)
		);
	}
	
	render()
	{
		return (
			<div className="AnchorList">
				<ul>
					{this.mapAnchorListToElements()}
				</ul>
			</div>
		);
	}
}

AnchorList.propTypes = {
	//each anchorObject should have 3 properties: 
	// - label: the text to display in the anchor tag.
	// - anchor: the ID of the element to anchor to (don't include the # character)
	// - isMatch: a boolean, stating if this entity was a matching result in a filter
	anchorObjects: PropTypes.array.isRequired
};

export default AnchorList;