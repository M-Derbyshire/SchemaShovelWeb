import React, { Component } from 'react';
import './App.css';
import DatabaseSelection from '../DatabaseSelection/DatabaseSelection';


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
		if(this.state.selectedDatabaseIndex !== index)
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
				</header>
				
				<DatabaseSelection 
					selectedDatabaseIndex={this.state.selectedDatabaseIndex} 
					setSelectedDatabaseIndex={this.setSelectedDatabaseIndex.bind(this)} />
			</div>
		);
	}
}

export default App;