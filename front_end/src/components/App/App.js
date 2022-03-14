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
			apiSettings: {
				apiBaseURL: process.env.REACT_APP_API_BASE_URL,
				dbNameCharLimit: Number(process.env.REACT_APP_DB_NAME_CHAR_LIMIT),
				entityDescCharLimit: Number(process.env.REACT_APP_ENTITY_DESC_CHAR_LIMIT)
			},
			
			//Orignially, other things were loaded before this was instantiated, so you may see a lot of components 
			//that can wait for the apiAccessor to be available, instead of it being a required prop
			apiAccessor:  new APIAccessor(process.env.REACT_APP_API_BASE_URL, this.onErrorHandler.bind(this)),
			databaseList: [],
			errorList: []
		};
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
							dbNameCharLimit={ apiSettings.dbNameCharLimit } />
					</Route>
					
					<Route path="/view/:id">
						<DatabaseViewer 
							apiAccessor= { apiAccessor } 
							entityDescCharLimit={ apiSettings.entityDescCharLimit } />
					</Route>
					
					<Route path="/">
						<DatabaseSelection 
							apiAccessor={ apiAccessor }
							dbNameCharLimit={ apiSettings.dbNameCharLimit } />
					</Route>
				</Switch>
			</div>
		);
	}
}

export default withRouter(App);