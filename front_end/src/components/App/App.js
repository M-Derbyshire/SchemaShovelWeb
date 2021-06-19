import React, { Component } from 'react';
import './App.css';
import APIAccessor from '../../apiAccess/APIAccessor/APIAccessor';
import DatabaseSelection from '../DatabaseSelection/DatabaseSelection';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';


class App extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			selectedDatabaseIndex: -1,
			apiSettings: null,
			apiAccessor: null,
			databaseList: [],
			errorList: []
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
			.catch(err => this.onErrorHandler(`Error while loading API settings: ${err.message}`));
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
	
	
	
	onErrorHandler(errorText)
	{
		console.error(errorText);
		
		this.setState({
			errorList: [...this.state.errorList, errorText]
		});
	}
	
	errorMessageMapper(errorText, index)
	{
		const closeFunc = () => {
			
			const newErrorList = this.state.errorList;
			newErrorList.splice(index, 1);
			
			this.setState({
				errorList: newErrorList
			});
		};
		
		return (
			<ErrorMessage key={index} errorText={errorText} closeButtonOnClick={closeFunc.bind(this)} />
		);
	}
	
	
	
	render()
	{
		return (
			<div className="App">
				
				<ErrorDisplay>
					{this.state.errorList.map(this.errorMessageMapper.bind(this))}
				</ErrorDisplay>
				
				<header>
					<h1>SchemaShovel Web</h1>
				</header>
				
				<DatabaseSelection apiAccessor={ this.state.apiAccessor } />
			</div>
		);
	}
}

export default App;