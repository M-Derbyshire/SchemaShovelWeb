import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import DatabaseLoadOptions from '../DatabaseLoadOptions/DatabaseLoadOptions';

class DatabaseSelection extends Component
{
	render()
	{
		return (
			<div className="DatabaseSelection">
				<header>
					<h1>Select a database schema below (or upload a new schema) to begin</h1>
				</header>
				<SelectableList selectedItemIndex={this.props.selectedDatabaseIndex} 
					setSelectedItemIndex={this.props.setSelectedDatabaseIndex} 
					isLoading={(this.props.databaseList.length === 0)}
				>
					{this.props.databaseList}
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
	databaseList: PropTypes.array.isRequired,
	apiAccessor: PropTypes.object
};

export default DatabaseSelection;