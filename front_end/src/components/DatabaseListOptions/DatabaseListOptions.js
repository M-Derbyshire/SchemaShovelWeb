import React, { Component } from 'react';
import './DatabaseListOptions.css';
import PropTypes from 'prop-types';

class DatabaseListOptions extends Component
{	
	async _deleteSelectedDatabase()
	{
		try
		{
			await this.props.deleteSelectedDatabase();
		}
		catch(err)
		{
			//Error display handled by App
		}
	}
	
	render()
	{
		const loadAndDeleteDisabled = (this.props.selectedDatabaseID < 0);
		
		return (
			<div className="DatabaseListOptions">
				<button className="loadDatabaseButton" 
						disabled={loadAndDeleteDisabled}
						onClick={() => {}}>
					Load Database
				</button>
				
				<button className="deleteDatabaseButton" 
						disabled={loadAndDeleteDisabled}
						onClick={async () => await this._deleteSelectedDatabase()}>
					Delete Database
				</button>
				
				<button className="addNewDatabaseButton" onClick={() => {}}>
					Add New Database
				</button>
			</div>
		);
	}
}

DatabaseListOptions.propTypes = {
	deleteSelectedDatabase: PropTypes.func.isRequired, //Should be async
	selectedDatabaseID: PropTypes.number.isRequired, //Should be -1 if nothing selected
};

export default DatabaseListOptions;