import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';
import DatabaseListOptions from '../DatabaseListOptions/DatabaseListOptions';

class DatabaseSelection extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			databaseList: [],
			selectedDatabaseIndex: -1,
			hasFailedToLoad: false,
			isLoadingList: false
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
	
	componentDidUpdate()
	{
		if(this.state.databaseList.length === 0 && this.props.apiAccessor && 
			!this.state.hasFailedToLoad && !this.state.isLoadingList)
		{
			this.props.apiAccessor.getDatabaseList()
				.then((list) => {
					this.setState({
						databaseList: list,
						isLoadingList: false
					});
				}).catch((err) => {
					this.setState({
						hasFailedToLoad: true,
						isLoadingList: false
					});
				});
			
			//Stops the above being called twice
			this.setState({
				isLoadingList: true
			});
		}
	}
	
	_forceDidUpdateHandlerForTests()
	{
		this.componentDidUpdate();
	}
	
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
					isLoading={(this.state.databaseList.length === 0)}
					hasFailedToLoad={this.state.hasFailedToLoad}
				>
					{this.state.databaseList.map(this.databaseListMapper.bind(this))}
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