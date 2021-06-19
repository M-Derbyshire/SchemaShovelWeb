import React, { Component } from 'react';
import './DatabaseSelection.css'
import PropTypes from 'prop-types';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';
import DatabaseLoadOptions from '../DatabaseLoadOptions/DatabaseLoadOptions';

class DatabaseSelection extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			databaseList: [],
			selectedDatabaseIndex: -1
		};
	}
	
	setSelectedDatabaseIndex(index)
	{
		if(this.state.selectedDatabaseIndex !== index)
		{
			this.setState({ selectedDatabaseIndex: index });
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
				saveChanges={async (newName) => { 
					const result = await updateDatabaseName(db.id, newName);
					if(Object.keys(result).length === 0) throw new Error("Unable to update database name.");
				}} 
				saveErrorHandler={() => {}}
			/>
		);
	}
	
	componentDidUpdate()
	{
		if(this.state.databaseList.length === 0 && this.props.apiAccessor && !this.props.hasFailedToLoadDatabaseList)
		{
			this.props.apiAccessor.getDatabaseList()
				.then((list) => {
					this.setState({
						databaseList: list
					});
				}); //Should not need to catch, as error handling handled by apiAccessor
		}
	}
	
	_forceDidUpdateHandlerForTests()
	{
		this.componentDidUpdate();
	}
	
	render()
	{
		const hasFailedToLoad = (this.state.databaseList.length === 0 && !!this.props.hasFailedToLoadDatabaseList);
		const selectedDatabaseIndex = (hasFailedToLoad) ? -1 : this.state.selectedDatabaseIndex;
		
		return (
			<div className="DatabaseSelection">
				<header>
					<h1>Select a database schema below (or upload a new schema) to begin</h1>
				</header>
				<SelectableList selectedItemIndex={this.state.selectedDatabaseIndex} 
					setSelectedItemIndex={this.setSelectedDatabaseIndex.bind(this)} 
					isLoading={(this.state.databaseList.length === 0)}
					hasFailedToLoad={hasFailedToLoad}
				>
					{this.state.databaseList.map(this.databaseListMapper.bind(this))}
				</SelectableList>
				<DatabaseLoadOptions loadSelectedDatabase={() => {}} 
						selectedDatabaseIndex={selectedDatabaseIndex} />
			</div>
		);
	}
}

DatabaseSelection.propTypes = {
	apiAccessor: PropTypes.object,
	hasFailedToLoadDatabaseList: PropTypes.bool
};

export default DatabaseSelection;