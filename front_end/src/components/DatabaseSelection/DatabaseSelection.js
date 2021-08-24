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
	//Used if the user leaves changes route, but a promise is still unresolved.
	//The promise will try to setState an unmounted component, so this can stop it.
	//This can't be held in state, as it won't get set in componentWillUnount
	_isMounted: boolean = false;
	
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
					if(this._isMounted) this.setState({
						databaseList: list
					});
				}).catch((err) => {
					if(this._isMounted) this.setState({
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
	* Attempts to start the retrieval of the list of databases, and sets this._isMounted to true
	 */
	componentDidMount()
	{
		//This is more useful for integration tests, 
		//as in reality, the apiAccess probably hasn't been passed yet
		this.startDatabaseListRetrieval();
		this._isMounted = true;
	}
	
	/**
	* Sets this._isMounted to false
	 */
	componentWillUnmount()
	{
		this._isMounted = false;
	}
	
	/** Render the DatabaseSelection */
	render()
	{
		const selectedDatabaseIndex = (this.state.hasFailedToLoad) ? -1 : this.state.selectedDatabaseIndex;
		const selectedDatabaseID = 
			(selectedDatabaseIndex < 0) ? -1 : this.state.databaseList[selectedDatabaseIndex].id;
		
		const listChildren = 
			(!this.state.databaseList) ? "" : this.state.databaseList.map(this.databaseListMapper.bind(this));
		
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
					{listChildren}
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