import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';
import DatabaseLoadOptions from '../DatabaseLoadOptions/DatabaseLoadOptions';

class DatabaseSelection extends Component
{
	databaseListMapper(db)
	{
		const textLengthLimit = 100;
		
		const updateDatabaseName = (this.props.updateDatabaseName) ? 
									this.props.updateDatabaseName :
									() => {};
		
		return (
			<EditableItem 
				key={db.id}
				text={db.name} 
				textLengthLimit={textLengthLimit} 
				saveChanges={async (newName) => await updateDatabaseName(db.id, newName)} 
				saveErrorHandler={() => {}}
			/>
		);
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
					isLoading={(this.props.databaseList.length === 0)}
				>
					{this.props.databaseList.map(this.databaseListMapper.bind(this))}
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
	updateDatabaseName: PropTypes.func
};

export default DatabaseSelection;