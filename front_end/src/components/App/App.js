import React, { Component } from 'react';
import './App.css';
import SelectableList from '../SelectableList/SelectableList';
import EditableItem from '../EditableItem/EditableItem';


class App extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			selectedDatabaseIndex: -1
		};
	}
	
	setSelectedDatabaseIndex(index)
	{
		if(this.state.selectedItemIndex !== index)
		{
			this.setState({ selectedDatabaseIndex: index });
		}
	}
	
	render()
	{
		return (
			<div className="App">
				<header>
					<h1>SchemaShovel Web</h1>
					<h2>Select a database schema below (or upload a new schema) to begin</h2>
				</header>
				
				<SelectableList selectedItemIndex={this.state.selectedDatabaseIndex} 
						setSelectedItemIndex={this.setSelectedDatabaseIndex.bind(this)} >
					<EditableItem isSelected text="Test 1" saveChanges={() => {}} />
					<EditableItem text="Test 2" saveChanges={() => {}} />
					<EditableItem text="Test 3" saveChanges={() => {}} />
				</SelectableList>
			</div>
		);
	}
}

export default App;