import React, { Component } from 'react';
import './DatabaseListOptions.css';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class DatabaseListOptions extends Component
{	
	constructor(props)
	{
		super(props);
		
		this.state = {
			isDeleting: false
		};
	}
	
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
	deleteSelectedDatabase: PropTypes.func.isRequired, //Should be async
	selectedDatabaseID: PropTypes.number.isRequired //Should be -1 if nothing selected
};

export default withRouter(DatabaseListOptions);