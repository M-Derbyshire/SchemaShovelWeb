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
			apiAccessor: null,
			databaseList: []
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
			throw new Error("Settings JSON is misshapen.");
		}
		
		this.setState({
			apiSettings: settings,
			apiAccessor: new APIAccessor(settings.apiBaseURL)
		});
	}
	
	render()
	{
		const apiAccessor = this.state.apiAccessor;
		
		return (
			<div className="App">
				<header>
					<h1>SchemaShovel Web</h1>
				</header>
				
				<DatabaseSelection apiAccessor={ this.state.apiAccessor } />
			</div>
		);
	}
}

export default App;