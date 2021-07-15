import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';
import DatabaseListOptions from '../DatabaseListOptions/DatabaseListOptions';

class DatabaseSelection extends Component
{
	//Used if the user leaves changes route, but a promise is still unresolved.
	//The promise will try to setState an unmounted component, so this can stop it.
	//This can't be held in state, as it won't get set in componentWillUnount
	_isMounted: boolean = false;
	
	constructor(props)
	{
		super(props);
		
		this.state = {
			databaseList: null, //Should be set to null when considered "not yet loaded"
			selectedDatabaseIndex: -1,
			hasFailedToLoad: false
		};
	}
	
	setSelectedDatabaseIndex(index)
	{
		if(this.state.selectedDatabaseIndex !== index)
		{
			this.setState({ selectedDatabaseIndex: index });
		}
	}
	
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
	
	databaseListMapper(db)
	{
		const textLengthLimit = 100;
		
		const apiAccessor = this.props.apiAccessor;
		const updateDatabaseName = (apiAccessor) ? 
									apiAccessor.updateDatabaseName.bind(apiAccessor) :
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
	
	componentDidUpdate()
	{
		this.startDatabaseListRetrieval();
	}
	
	componentDidMount()
	{
		//This is more useful for integration tests, 
		//as in reality, the apiAccess probably hasn't been passed yet
		this.startDatabaseListRetrieval();
		this._isMounted = true;
	}
	
	componentWillUnmount()
	{
		this._isMounted = false;
		this._databaseList = null;
	}
	
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
	apiAccessor: PropTypes.object
};

export default DatabaseSelection;