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
		
		const updateDatabaseName = (this.props.apiAccessor) ? 
									this.props.apiAccessor.updateDatabaseName.bind(this.props.apiAccessor) :
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
		if(this.state.databaseList.length === 0 && this.props.apiAccessor && !this.props.apiAccessor.hasErrors())
		{
			this.props.apiAccessor.getDatabaseList()
				.then((list) => {
					this.setState({
						databaseList: list
					});
				}); //Should not need to catch, as error handling handled by apiAccessor
		}
	}
	
	forceDidUpdateHandlerForTests()
	{
		this.componentDidUpdate();
	}
	
	render()
	{
		return (
			<div className="DatabaseSelection">
				<header>
					<h1>Select a database schema below (or upload a new schema) to begin</h1>
				</header>
				<SelectableList selectedItemIndex={this.state.selectedDatabaseIndex} 
					setSelectedItemIndex={this.setSelectedDatabaseIndex.bind(this)} 
					isLoading={(this.state.databaseList.length === 0)}
					hasFailedToLoad={!!this.props.hasFailedToLoadDatabaseList}
				>
					{this.state.databaseList.map(this.databaseListMapper.bind(this))}
				</SelectableList>
				<DatabaseLoadOptions loadSelectedDatabase={() => {}} 
						selectedDatabaseIndex={this.state.selectedDatabaseIndex} />
			</div>
		);
	}
}

DatabaseSelection.propTypes = {
	apiAccessor: PropTypes.object,
	hasFailedToLoadDatabaseList: PropTypes.bool
};

export default DatabaseSelection;