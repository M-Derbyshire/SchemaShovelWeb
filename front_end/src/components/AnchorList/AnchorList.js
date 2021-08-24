import React, { Component } from 'react';
import './AnchorList.css';
import PropTypes from 'prop-types';

/**
* Provides a list of anchor tags for the different entities in the currently viewed database record, 
* so the user can quickly navigate to each one
*
*@component
 */
class AnchorList extends Component
{
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
					
					<a href={"#" + anchor.anchor} className="entityAnchor">
						{anchor.isMatch && <span className="anchorIsMatchText">(Match) </span>}
						{this.breakEntitiesToWords(anchor.label)}
					</a>
				</li>
			)
		);
	}
	
	breakEntitiesToWords(label)
	{
		//This is part of a hack, to make sure the labels line-break in the best way.
		//We want them to break before each space, if possible.
		//The CSS for the li elements will remove the width of the space we're adding,
		//	here, so they don't appear to have a space.
		return label.replace(/\./g, " .");
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
	/**
	* An array of "anchor objects", created by an instance of DbEntityAnchorMapper.
	 */
	anchorObjects: PropTypes.array.isRequired,
	
	/**
	* When a table is the subject of a search for foreign keys, an anchor object for the table 
	* can be passed in as this prop
	 */
	fkSubjectTable: PropTypes.object
};

export default AnchorList;