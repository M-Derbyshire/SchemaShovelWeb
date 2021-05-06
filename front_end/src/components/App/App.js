import React, { Component } from 'react';
import './App.css';
import SelectableList from '../SelectableList/SelectableList';


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
					<h1>Schema Shovel Web</h1>
					<h2>Select a database schema below (or upload a new schema) to begin</h2>
				</header>
				
				<SelectableList selectedItemIndex={this.state.selectedDatabaseIndex} 
					setSelectedItemIndex={this.setSelectedDatabaseIndex.bind(this)} >
					<p>Test1</p>
					<p>Test2</p>
					<p>Test3</p>
				</SelectableList>
			</div>
		);
	}
}

export default App;