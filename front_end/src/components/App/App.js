import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import APIAccessor from '../../apiAccess/APIAccessor/APIAccessor';
import DatabaseSelection from '../DatabaseSelection/DatabaseSelection';
import DatabaseAddition from '../DatabaseAddition/DatabaseAddition';
import DatabaseViewer from '../DatabaseViewer/DatabaseViewer';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

/**
* The root component of the project (This must be rendered in a router.) 
* As well as rendering the correct component for the current route, this also handles the loading 
* of the API settings, setting up an APIAccessor instance, and displaying any errors.
*
*@component
 */
class App extends Component
{
	
	/** Create a new App instance */
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
	
	/** 
	* Runs after the component has mounted. This will trigger the loadAPISettings() method, 
	* with the path to the API settings JSON.
	*/
	componentDidMount()
	{
		this.loadAPISettings(`${process.env.PUBLIC_URL}/settings.json`);
	}
	
	/** 
	* Loads the API settings JSON, then calls the onAPISettingsLoad() method (or onErrorHandler(), if 
	* there was an error)
	* @param {string} path - The URL path of the settings JSON
	*/
	loadAPISettings(path)
	{
		fetch(path)
			.then(response => response.json())
			.then(json => this.onAPISettingsLoad(json))
			.catch(err => this.onErrorHandler(`Error while loading API settings: ${err.message}`));
	}
	
	/** 
	* Once the API settings have been loaded, this will add them to the state, and also add a new 
	* APIAccessor instance (Or this will throw an exception, if there are missing settings).
	* @param {Object} settings - The settings object
	* @param {string} settings.apiBaseURL - The Base URl of the API
	* @param {number} settings.dbNameCharLimit - The database's character limit for database record names
	* @param {number} settings.entityDescCharLimit - The database's character limit for the description columns of the various entities
	*/
	onAPISettingsLoad(settings)
	{
		if(!settings || !settings.apiBaseURL || !settings.dbNameCharLimit || !settings.entityDescCharLimit)
		{
			throw new Error("Settings JSON is misshapen.");
		}
		
		this.setState({
			apiSettings: settings,
			apiAccessor: new APIAccessor(settings.apiBaseURL, this.onErrorHandler.bind(this))
		});
	}
	
	/** 
	* Handles the recording of all errors, which will then be displayed by this component. Can be given 
	* an error to add as a parameter -- however this will also check the APIAccessor instance for any new 
	* errors there
	* @param {string} [errorText] - The text of an error to be added to the display
	*/
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
	
	/** 
	* This is the callback for mapping an array of error messages. It turns strings into ErrorMessage 
	* components
	* @param {string} errorText - The text of an error to be added to the display
	* @param {number} index - The index of this error message in the array being mapped
	*/
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
	
	
	/** Render the component */
	render()
	{
		const apiSettings = this.state.apiSettings;
		const apiAccessor = this.state.apiAccessor;
		
		return (
			<div className="App">
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
			</div>
		);
	}
}

export default withRouter(App);