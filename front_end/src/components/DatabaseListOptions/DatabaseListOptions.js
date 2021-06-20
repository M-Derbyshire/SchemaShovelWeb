import React, { Component } from 'react';
import './DatabaseListOptions.css';
import PropTypes from 'prop-types';

class DatabaseListOptions extends Component
{
	
	
	render()
	{
		return (
			<div className="DatabaseListOptions">
				<button className="loadDatabaseButton" disabled={this.props.selectedDatabaseIndex < 0}
					onClick={() => this.props.loadSelectedDatabase()}>
				Load Database</button>
				
				{/* This will eventually take you to the database upload route */}
				<button className="addNewDatabaseButton" onClick={() => {}}>Add New Database</button>
			</div>
		);
	}
}

DatabaseListOptions.propTypes = {
	loadSelectedDatabase: PropTypes.func.isRequired,
	selectedDatabaseIndex: PropTypes.number.isRequired,
};

export default DatabaseListOptions;