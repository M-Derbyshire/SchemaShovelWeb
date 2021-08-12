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
		const allAnchors = [];
		
		if(this.props.fkSubjectTable)
			allAnchors.push(this.props.fkSubjectTable);
		
		allAnchors.push(...this.props.anchorObjects);
		
		
		return allAnchors.map(
			(anchor, idx) => (
				<li key={`${anchor.anchor}`} 
					className={(this.props.fkSubjectTable && idx === 0) ? "fkSubjectAnchor" : ""}>
					
					<a href={"#" + anchor.anchor}>
						{anchor.isMatch && <span className="anchorIsMatchText">(Match) </span>}
						{anchor.label}
					</a>
				</li>
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
	anchorObjects: PropTypes.array.isRequired,
	
	//When a table is the subject of a search for foreign keys, an anchor object for the
	// the table can be passed in here
	fkSubjectTable: PropTypes.object
};

export default AnchorList;