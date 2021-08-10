import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import APIAccessor from '../../apiAccess/APIAccessor/APIAccessor';
import DatabaseSelection from '../DatabaseSelection/DatabaseSelection';
import DatabaseAddition from '../DatabaseAddition/DatabaseAddition';
import DatabaseViewer from '../DatabaseViewer/DatabaseViewer';
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
		this.loadAPISettings(`${process.env.PUBLIC_URL}/settings.json`);
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
		if(!settings || !settings.apiBaseURL || !settings.dbNameCharLimit)
		{
			throw new Error("Settings JSON is misshapen.");
		}
		
		this.setState({
			apiSettings: settings,
			apiAccessor: new APIAccessor(settings.apiBaseURL, this.onErrorHandler.bind(this))
		});
	}
	
	
	
	onErrorHandler(errorText = null)
	{
		let newErrors = [];
		
		const apiAccessor = this.state.apiAccessor;
		if(apiAccessor)
		{
			//APIAccessor will not contain the error once it's been retrieved
			while(apiAccessor.hasErrors())
			{
				const nextError = apiAccessor.getNextError();
				console.error(nextError);
				newErrors.push(nextError);
			}
		}
		
		if(errorText) 
		{
			console.error(errorText);
			newErrors.push(errorText)
		}
		
		this.setState({
			errorList: [...this.state.errorList, ...newErrors]
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
		const apiSettings = this.state.apiSettings;
		const apiAccessor = this.state.apiAccessor;
		
		return (
			<div className="App">
				<BrowserRouter>
					<ErrorDisplay>
						{this.state.errorList.map(this.errorMessageMapper.bind(this))}
					</ErrorDisplay>
					
					<header>
						<h1>SchemaShovel Web</h1>
					</header>
					
					<Switch>
						
						<Route exact path="/create">
							<DatabaseAddition 
								apiAccessor= { apiAccessor }
								onErrorHandler={this.onErrorHandler.bind(this)}
								dbNameCharLimit={ (apiSettings) ? apiSettings.dbNameCharLimit : -1 } />
						</Route>
						
						<Route path="/view/:id">
							<DatabaseViewer 
								apiAccessor= { apiAccessor } 
								entityDescCharLimit={ (apiSettings) ? apiSettings.entityDescCharLimit : -1 } />
						</Route>
						
						<Route path="/">
							<DatabaseSelection 
								apiAccessor={ apiAccessor }
								dbNameCharLimit={ (apiSettings) ? apiSettings.dbNameCharLimit : -1 } />
						</Route>
					</Switch>
					
				</BrowserRouter>
			</div>
		);
	}
}

export default App;