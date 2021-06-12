import React, { Component } from 'react';
import './App.css';
import APIAccessor from '../../apiAccess/APIAccessor/APIAccessor';
import DatabaseSelection from '../DatabaseSelection/DatabaseSelection';


class App extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			selectedDatabaseIndex: -1,
			apiSettings: null,
			apiAccessor: null
		};
	}
	
	componentDidMount()
	{
		this.loadAPISettings("settings.json");
	}
	
	loadAPISettings(path)
	{
		fetch(path)
			.then(response => response.json())
			.then(json => this.onAPISettingsLoad(json))
			.catch(err => console.error(`Error while loading API settings: ${err.message}`));
	}
	
	onAPISettingsLoad(settings)
	{
		if(!settings || !settings.apiBaseURL)
		{
			throw new Error("Settings JSON is mishapen.");
		}
		
		this.setState({
			apiSettings: settings,
			apiAccessor: new APIAccessor(settings.apiBaseURL)
		});
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