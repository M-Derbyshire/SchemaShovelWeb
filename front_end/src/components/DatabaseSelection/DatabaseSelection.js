import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';

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
						setSelectedItemIndex={this.props.setSelectedDatabaseIndex} >
					<EditableItem isSelected text="Test 1" saveChanges={() => {}} />
					<EditableItem text="Test 2" saveChanges={() => {}} />
					<EditableItem text="Test 3" saveChanges={() => {}} />
				</SelectableList>
			</div>
		);
	}
}

DatabaseSelection.propTypes = {
	selectedDatabaseIndex: PropTypes.number,
	setSelectedDatabaseIndex: PropTypes.func.isRequired
};

export default DatabaseSelection;