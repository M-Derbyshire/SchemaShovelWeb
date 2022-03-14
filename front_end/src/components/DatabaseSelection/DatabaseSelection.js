import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';
import DatabaseListOptions from '../DatabaseListOptions/DatabaseListOptions';

/**
* Used to view the list of databases in the app's database. Also used to add/remove/rename/load databases
*
*@component
 */
class DatabaseSelection extends Component
{
	
	/** Create a new instance of DatabaseSelection */
	constructor(props)
	{
		super(props);
		
		this.state = {
			databaseList: null, //Should be set to null when considered "not yet loaded"
			selectedDatabaseIndex: -1,
			hasFailedToLoad: false
		};
	}
	
	/**
	* Sets the selected database's index (index in the this.state.databaseList array)
	* @param {number} index - The index in the this.state.databaseList array
	 */
	setSelectedDatabaseIndex(index)
	{
		if(this.state.selectedDatabaseIndex !== index)
		{
			this.setState({ selectedDatabaseIndex: index });
		}
	}
	
	/**
	* Deletes a database record from the app's database, and removes it from the displayed list
	* @param {number} id - The ID of the database record
	 */
	async deleteDatabaseAndRemoveFromList(id)
	{
		try
		{
			await this.props.apiAccessor.deleteDatabase(id);
			
			this.setState({
				selectedDatabaseIndex: -1,
				databaseList: this.state.databaseList.filter((db) => db.id !== id)
			});
		}
		catch(err)
		{
			//Error display handled by App
		}
	}
	
	/**
	* A callback function for a map function. This maps database objects, from the API, into 
	* EditableItem components (so the database name can be changed by the user)
	* @param {object} db - The database object (should have id and name properties)
	 */
	databaseListMapper(db)
	{
		const apiAccessor = this.props.apiAccessor;
		const updateDatabaseName = (apiAccessor) ? 
									apiAccessor.updateDatabaseName.bind(apiAccessor) :
									async () => {};
		
		return (
			<EditableItem 
				key={db.id}
				text={db.name} 
				textLengthLimit={this.props.dbNameCharLimit} 
				saveChanges={async (newName) => await updateDatabaseName(db.id, newName)} 
				saveErrorHandler={() => {}}
			/>
		);
	}
	
	/**
	* Starts the retrieval of the list of databases, once an instance of APIAccessor has been provided 
	* as a prop
	 */
	startDatabaseListRetrieval()
	{
		if(this.state.databaseList === null && this.props.apiAccessor && !this.state.hasFailedToLoad)
		{
			this.props.apiAccessor.getDatabaseList()
				.then((list) => {
					this.setState({
						databaseList: list
					});
				}).catch((err) => {
					this.setState({
						hasFailedToLoad: true,
						databaseList: null
					});
				});
		}
	}
	
	/**
	* Attempts to start the retrieval of the list of databases
	 */
	componentDidUpdate()
	{
		this.startDatabaseListRetrieval();
	}
	
	/**
	* Attempts to start the retrieval of the list of databases
	 */
	componentDidMount()
	{
		this.startDatabaseListRetrieval();
	}
	
	/**
	* Aborts any active fetch requests
	 */
	componentWillUnmount()
	{
		if(this.props.apiAccessor)
			this.props.apiAccessor.abortRequests();
	}
	
	/** Render the DatabaseSelection */
	render()
	{
		const selectedDatabaseIndex = (this.state.hasFailedToLoad) ? -1 : this.state.selectedDatabaseIndex;
		const selectedDatabaseID = 
			(selectedDatabaseIndex < 0) ? -1 : this.state.databaseList[selectedDatabaseIndex].id;
		
		
		return (
			<div className="DatabaseSelection">
				<header>
					<h1>Select a database schema below (or upload a new schema) to begin</h1>
				</header>
				<SelectableList selectedItemIndex={this.state.selectedDatabaseIndex} 
					setSelectedItemIndex={this.setSelectedDatabaseIndex.bind(this)} 
					isLoading={(!this.state.hasFailedToLoad && !this.state.databaseList)}
					hasFailedToLoad={this.state.hasFailedToLoad}
				>
					{this.state.databaseList && this.state.databaseList.map(this.databaseListMapper.bind(this))}
				</SelectableList>
				<DatabaseListOptions 
					deleteSelectedDatabase={async () => await this.deleteDatabaseAndRemoveFromList.apply(this, [selectedDatabaseID])} 
					selectedDatabaseID={selectedDatabaseID} />
			</div>
		);
	}
}

DatabaseSelection.propTypes = {
	/**
	* An instance of APIAccessor (if this is undefined, a loading message will be displayed)
	 */
	apiAccessor: PropTypes.object,
	
	/**
	* The character limit for database names
	 */
	dbNameCharLimit: PropTypes.number.isRequired
};

export default DatabaseSelection;