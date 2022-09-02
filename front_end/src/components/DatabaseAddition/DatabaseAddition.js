import React, { Component } from 'react';
import './DatabaseAddition.css';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AddDatabaseForm from '../AddDatabaseForm/AddDatabaseForm';
import SQLScriptsDownloads from '../SQLScriptsDownloads/SQLScriptsDownloads';

/**
* Controls the additions of database records to the app's database, and renders an AddDatabaseForm component
*
*@component
 */
class DatabaseAddition extends Component
{
	/** Create a new DatabaseAddition instance */
	constructor(props)
	{
		super(props);
		
		this.state = {
			isCreating: false
		};
	}
	
	
	/**
	* Aborts any active fetch requests
	 */
	componentWillUnmount()
	{
		if(this.props.apiAccessor)
			this.props.apiAccessor.abortRequests();
	}
	
	
	
	/**
	* Handles the cancelling of the database addition (takes the user to the homepage)
	 */
	onCancelHandler()
	{
		this.props.history.push("/");
	}
	
	/**
	* Handles the addition of the database record to the database
	* @param {string} dbName - The name of the new database record
	* @param {string} dbJSON - The JSON representation of the database schemas
	 */
	databaseAdditionHandler(dbName, dbJSON)
	{
		this.setState({
			isCreating: true
		}, async () => {
			try
			{
				await this.props.apiAccessor.createDatabase(JSON.stringify({
					name: dbName,
					schemas: JSON.parse(dbJSON)
				}));
			}
			catch(err)
			{
				//Error display handled by App
			}
			
			this.props.history.push("/");
		});
	}
	
	//** Renders the component */
	render()
	{
		const isLoading = (!this.props.apiAccessor);
		const isDisabled = (isLoading || this.state.isCreating);
		
		return (
			<div className="DatabaseAddition">
				<header>
					<h1>Add a database schema</h1>
				</header>
				
				<AddDatabaseForm 
					formOnSubmit={this.databaseAdditionHandler.bind(this)} 
					onErrorHandler={this.props.onErrorHandler} 
					onCancelHandler={this.onCancelHandler.bind(this)} 
					isLoading={isLoading}
					disabled={isDisabled}
					isSaving={this.state.isCreating}
					dbNameCharLimit={this.props.dbNameCharLimit} />
				
				
				<SQLScriptsDownloads />
			</div>
		);
	}
}

DatabaseAddition.propTypes = {
	/**
	* An instance of APIAccessor. If this is undefined, a loading message will be shown
	 */
	apiAccessor: PropTypes.object,
	
	/**
	* A function to call if there is an error
	* @param {string} errorText - The error text
	 */
	onErrorHandler: PropTypes.func.isRequired,
	
	/**
	* The character limit for database record names
	 */
	dbNameCharLimit: PropTypes.number.isRequired
};

export default withRouter(DatabaseAddition);