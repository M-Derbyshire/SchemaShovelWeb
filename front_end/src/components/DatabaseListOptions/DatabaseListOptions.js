import React, { Component } from 'react';
import './DatabaseListOptions.css';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
* Provides buttons for actions that can be completed, in relation to database records in the 
* app's database. (Load, create and delete.)
*
*@component
 */
class DatabaseListOptions extends Component
{	
	/** Create a new DatabaseListOptions instance */
	constructor(props)
	{
		super(props);
		
		this.state = {
			isDeleting: false
		};
	}
	
	/**
	* Deletes the currently selected database record
	 */
	_deleteSelectedDatabase()
	{
		this.setState({
			isDeleting: true
		}, async () => {
			try
			{
				await this.props.deleteSelectedDatabase();
			}
			catch(err)
			{
				//Error display handled by App
			}
			
			this.setState({
				isDeleting: false
			});
		});
	}
	
	/** Render the DatabaseListOptions */
	render()
	{
		const loadAndDeleteDisabled = (this.props.selectedDatabaseID < 0 || this.state.isDeleting);
		
		return (
			<div className="DatabaseListOptions">
				<button className="loadDatabaseButton" 
						disabled={loadAndDeleteDisabled}
						onClick={() => this.props.history.push(`/view/${this.props.selectedDatabaseID}`)}>
					Load Database
				</button>
				
				<button className="deleteDatabaseButton" 
						disabled={loadAndDeleteDisabled}
						onClick={() => this._deleteSelectedDatabase()}>
					{(this.state.isDeleting) ? "Deleting..." : "Delete Database"}
				</button>
				
				<button className="addNewDatabaseButton" 
						onClick={() => this.props.history.push("/create")}
						disabled={this.state.isDeleting}>
					Add New Database
				</button>
			</div>
		);
	}
}

DatabaseListOptions.propTypes = {
	/**
	* An async function that will delete the currently selected database
	 */
	deleteSelectedDatabase: PropTypes.func.isRequired,
	
	/**
	* The ID of the currently selected database (or -1 if nothing is selected)
	 */
	selectedDatabaseID: PropTypes.number.isRequired
};

export default withRouter(DatabaseListOptions);