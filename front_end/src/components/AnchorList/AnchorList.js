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
			(anchor, index) => (
				<li key={`${index}-${anchor.anchor}`}><a href={"#" + anchor.anchor}>{anchor.label}</a></li>
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
	//each anchorObject should have 2 properties: 
	// - label: the text to display in the anchor tag.
	// - anchor: the ID of the element to anchor to (don't include the # character)
	anchorObjects: PropTypes.array
};

export default AnchorList;