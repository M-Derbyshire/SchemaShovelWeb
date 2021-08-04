import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseViewer.css';
import { withRouter } from 'react-router-dom';

class DatabaseViewer extends Component
{
	//Used if the user leaves changes route, but a promise is still unresolved.
	//The promise will try to setState an unmounted component, so this can stop it.
	//This can't be held in state, as it won't get set in componentWillUnount
	_isMounted: boolean = false;
	
	constructor(props)
	{
		super(props);
		
		this.state = {
			database: null,
			hasFailedToLoad: false
		};
	}
	
	returnToMenu()
	{
		this.props.history.push("/");
	}
	
	startDatabaseRetrieval()
	{
		//We may not have the apiAccessor yet (say, if the user goes directly to this route, 
		//rather than through the selection menu)
		
		
		//this.props.match.params.* is not supported anymore
		const dbID = window.location.pathname.split("/")[2];
		
		if(this.state.database === null && this.props.apiAccessor && !this.state.hasFailedToLoad)
		{
			this.props.apiAccessor.getDatabaseByID(dbID)
				.then((db) => {
					if(this._isMounted) this.setState({
						database: db,
						
					});
				}).catch((err) => {
					if(this._isMounted) this.setState({
						hasFailedToLoad: true,
						database: null
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
		const isLoading = (!hasFailedToLoad && !this.state.database);
		
		let titleText;
		if(isLoading) 
			titleText = "Loading...";
		else if(this.state.database)
			titleText = this.state.database.name;
		else
			titleText = "Error";
		
		return (
			<div className="DatabaseViewer">
				<header>
					<button onClick={this.returnToMenu.bind(this)}>Main Menu</button>
					<h1>{titleText}</h1>
				</header>
			</div>
		);
	}
}

DatabaseViewer.propTypes = {
	apiAccessor: PropTypes.object
};

export default withRouter(DatabaseViewer);