import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseEntity.css';
import EditableItem from '../EditableItem/EditableItem';

class DatabaseEntity extends Component
{
	
	childEntityToLiMapper(childEntity, index)
	{
		return (<li key={"dbEntityList-" + index}>{childEntity}</li>);
	}
	
	render()
	{
		const componentClassName = "DatabaseEntity";
		const matchClassName = "MatchingDatabaseEntity";
		const classList = 
			(this.props.isMatch) ? `${componentClassName} ${matchClassName}` : componentClassName;
		
		return (
			<div className={classList}>
				<h1>{this.props.name}</h1>
				
				{/*Description*/}
				<EditableItem 
					text={this.props.description} 
					saveChanges={this.props.saveDescriptionChanges} 
					saveErrorHandler={this.props.saveDescriptionErrorHandler} 
					textLengthLimit={this.props.descriptionCharLengthLimit} />
				
				{this.props.fkToSchemaTableName && 
					<div className="fkToTableInfo">
						<span className="fkToTableLabel">Foreign key to table: </span>
						<span className="fkToTableName">{this.props.fkToSchemaTableName}</span>
					</div>
				}
				
				<ul>
					{React.Children.map(this.props.children, this.childEntityToLiMapper.bind(this))}
				</ul>
			</div>
		);
	}
}

DatabaseEntity.propTypes = {
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired, //The color for the entity type
	isMatch: PropTypes.bool, //Is this specifically a match to the filter
	fkToSchemaTableName: PropTypes.string, //Should be formatted as <schema name>.<table name>
	
	//Will take 0 parameters (should be a closure that contains the required data already)
	//Used to update the database description
	//Will be an async function
	saveDescriptionChanges: PropTypes.func.isRequired,
	
	saveDescriptionErrorHandler: PropTypes.func.isRequired,
	descriptionCharLengthLimit: PropTypes.number.isRequired
};

export default DatabaseEntity;