import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';
import DatabaseLoadOptions from '../DatabaseLoadOptions/DatabaseLoadOptions';

class DatabaseSelection extends Component
{	
	constructor(props)
	{
		super(props);
		
		this.state = {
			databaseList: []
		};
	}
	
	render()
	{		
		return (
			<div className="DatabaseSelection">
				<header>
					<h1>Select a database schema below (or upload a new schema) to begin</h1>
				</header>
				<SelectableList selectedItemIndex={this.props.selectedDatabaseIndex} 
					setSelectedItemIndex={this.props.setSelectedDatabaseIndex} 
					isLoading={(this.state.databaseList.length === 0)}
				>
					{this.state.databaseList}
				</SelectableList>
				<DatabaseLoadOptions loadSelectedDatabase={() => {}} 
						selectedDatabaseIndex={this.props.selectedDatabaseIndex} />
			</div>
		);
	}
}

DatabaseSelection.propTypes = {
	selectedDatabaseIndex: PropTypes.number.isRequired,
	setSelectedDatabaseIndex: PropTypes.func.isRequired,
	apiAccessor: PropTypes.object
};

export default DatabaseSelection;