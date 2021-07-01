import React, { Component } from 'react';
import './DatabaseAddition.css';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AddDatabaseForm from '../AddDatabaseForm/AddDatabaseForm';

class DatabaseAddition extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			isCreating: false
		};
	}
	
	onCancelHandler()
	{
		this.props.history.push("/");
	}
	
	databaseAdditionHandler(dbName, dbJSON)
	{
		this.setState({
			isCreating: true
		}, async () => {
			try
			{
				await this.props.apiAccessor.createDatabase(JSON.stringify({
					name: dbName,
					schemas: JSON.parse(dbJSON)
				}));
			}
			catch(err)
			{
				//Error display handled by App
			}
			
			this.props.history.push("/");
		});
	}
	
	render()
	{
		const isLoading = (!this.props.apiAccessor);
		const isDisabled = (isLoading || this.state.isCreating);
		
		return (
			<div className="DatabaseAddition">
				<header>
					<h1>Add a database schema</h1>
				</header>
				
				<AddDatabaseForm 
					formOnSubmit={this.databaseAdditionHandler.bind(this)} 
					onErrorHandler={this.props.onErrorHandler} 
					onCancelHandler={this.onCancelHandler.bind(this)} 
					isLoading={isLoading}
					disabled={isDisabled} />
			</div>
		);
	}
}

DatabaseAddition.propTypes = {
	apiAccessor: PropTypes.object,
	onErrorHandler: PropTypes.func.isRequired
};

export default withRouter(DatabaseAddition);