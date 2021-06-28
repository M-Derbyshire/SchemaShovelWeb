import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AddDatabaseForm.css';
import TextFileInput from '../TextFileInput/TextFileInput';

class AddDatabaseForm extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			dbName: "",
			dbJSON: ""
		};
	}
	
	onSubmitHandler(e)
	{
		e.preventDefault();
		this.props.formOnSubmit();
	}
	
	cancelHandler(e)
	{
		e.preventDefault();
		this.props.onCancelHandler();
	}
	
	onDBNameChangeHandler(e)
	{
		this.setState({
			dbName: e.target.value
		});
	}
	
	setJSONText(dbJSON)
	{
		this.setState({
			dbJSON
		});
	}
	
	render()
	{
		let formContent;
		
		if(this.props.isLoading)
		{
			formContent = (<span className="infoText">Loading...</span>);
		}
		else
		{
			formContent = (
				<form onSubmit={this.onSubmitHandler.bind(this)}>
					<input 
						type="text" 
						className="databaseSchemaNameInput" 
						placeholder="Database Schema Name" 
						value={this.state.dbName}
						onChange={this.onDBNameChangeHandler.bind(this)}
						disabled={!!this.props.disabled} />
					
					<TextFileInput 
						onErrorHandler={this.props.onErrorHandler}
						setFileText={this.setJSONText.bind(this)}
						fileText={this.state.dbJSON}
						disabled={!!this.props.disabled} />
					
					<input 
						className="databaseSchemaSubmit" 
						type="submit" 
						value="Add Database Schema"
						disabled={!!this.props.disabled} />
					<button 
						className="databaseSchemaCancel" 
						onClick={this.cancelHandler.bind(this)}
						disabled={!!this.props.disabled} >
							Cancel
					</button>
				</form>
			);
		}
		
		return (
			<div className="AddDatabaseForm">
				{formContent}
			</div>
		);
	}
}

AddDatabaseForm.propTypes = {
	// Should be an asynchronous callback that takes 2 parameters: the name for the DB schema, and the JSON for it
	formOnSubmit: PropTypes.func.isRequired,
	
	onErrorHandler: PropTypes.func.isRequired,
	onCancelHandler: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
	disabled: PropTypes.bool
};

export default AddDatabaseForm;