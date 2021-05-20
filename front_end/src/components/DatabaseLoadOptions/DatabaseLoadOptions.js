import React, { Component } from 'react';
import './DatabaseLoadOptions.css';
import PropTypes from 'prop-types';

class DatabaseLoadOptions extends Component
{
	
	
	render()
	{
		return (
			<div className="DatabaseLoadOptions">
				<button className="loadDatabaseButton" disabled={this.props.selectedDatabaseIndex < 0}
					onClick={() => this.props.loadSelectedDatabase(this.props.selectedDatabaseIndex)}>
				Load Database</button>
				
				{/* This will eventually take you to the database upload route */}
				<button className="addNewDatabaseButton" onClick={() => {}}>Add New Database</button>
			</div>
		);
	}
}

DatabaseLoadOptions.propTypes = {
	loadSelectedDatabase: PropTypes.func.isRequired,
	selectedDatabaseIndex: PropTypes.number.isRequired,
};

export default DatabaseLoadOptions;