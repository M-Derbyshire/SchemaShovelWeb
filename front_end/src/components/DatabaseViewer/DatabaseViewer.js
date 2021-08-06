import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseViewer.css';
import { withRouter } from 'react-router-dom';
import FilterableSchemaList from '../../FilterableSchemaList/FilterableSchemaList';
import DatabaseEntityFilterOptions from '../DatabaseEntityFilterOptions/DatabaseEntityFilterOptions';

class DatabaseViewer extends Component
{
	//Used if the user leaves changes route, but a promise is still unresolved.
	//The promise will try to setState an unmounted component, so this can stop it.
	//This can't be held in state, as it won't get set in componentWillUnount
	_isMounted: boolean = false;
	
	constructor(props)
	{
		super(props);
		
		const schemaColor = "#ff0000";
		const tableColor = "#00ff00";
		const columnColor = "#0000ff";
		
		this.state = {
			dbName: null,
			dbSchemas: new FilterableSchemaList([], schemaColor, tableColor, columnColor),
			hasFailedToLoad: false,
			schemaColor: "#ff0000",
			tableColor: "#00ff00",
			columnColor: "#0000ff"
		};
	}
	
	returnToMenu()
	{
		this.props.history.push("/");
	}
	
	startDatabaseRetrieval()
	{
		//this.props.match.params.* is not supported anymore
		const dbID = window.location.pathname.split("/")[2];
		
		//We may not have the apiAccessor yet (say, if the user goes directly to this route, 
		//rather than through the selection menu)
		if(this.state.dbName === null && this.props.apiAccessor && !this.state.hasFailedToLoad)
		{
			const schemaColor = this.state.schemaColor;
			const tableColor = this.state.tableColor;
			const columnColor = this.state.columnColor;
			
			this.props.apiAccessor.getDatabaseByID(dbID)
				.then((db) => {
					if(this._isMounted) this.setState({
						dbName: db.name,
						dbSchemas: new FilterableSchemaList(db.schemas, schemaColor, tableColor, columnColor)
					});
				}).catch((err) => {
					if(this._isMounted) this.setState({
						hasFailedToLoad: true,
						dbName: null,
						dbSchemas: new FilterableSchemaList([], schemaColor, tableColor, columnColor)
					});
				});
		}
	}
	
	componentDidUpdate()
	{
		this.startDatabaseRetrieval();
	}
	
	componentDidMount()
	{
		this.startDatabaseRetrieval();
		this._isMounted = true;
	}
	
	componentWillUnmount()
	{
		this._isMounted = false;
		this._databaseList = null;
	}
	
	render()
	{
		const hasFailedToLoad = this.state.hasFailedToLoad;
		const isLoading = (!hasFailedToLoad && !this.state.dbName);
		
		let titleText;
		if(isLoading) 
			titleText = "Loading...";
		else if(this.state.dbName)
			titleText = this.state.dbName;
		else
			titleText = "Error";
		
		return (
			<div className="DatabaseViewer">
				<header>
					<div className="dbViewerHeaderRow">
						<button onClick={this.returnToMenu.bind(this)}>Main Menu</button>
						<h1>{titleText}</h1>
					</div>
					
					<div className="dbViewerHeaderRow">
						<DatabaseEntityFilterOptions 
							schemas={this.state.dbSchemas.getFullList()}
							runTextFilter={()=>{}}
							runFkFilter={()=>{}} />
					</div>
				</header>
			</div>
		);
	}
}

DatabaseViewer.propTypes = {
	apiAccessor: PropTypes.object
};

export default withRouter(DatabaseViewer);