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
		this.props.formOnSubmit(this.state.dbName, this.state.dbJSON);
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
		//This boolean shouldn't be needed, as the dbName and dbJSON inputs are marked as required.
		//However, it is up to the browser to control that, so just making sure. (in case of future 
		//dev mistake removing the required properties)
		const disableSubmitButton = (this.props.disabled || !this.state.dbName || !this.state.dbJSON);
		
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
						disabled={this.props.disabled}
						required />
					
					<TextFileInput 
						onErrorHandler={this.props.onErrorHandler}
						setFileText={this.setJSONText.bind(this)}
						fileText={this.state.dbJSON}
						disabled={this.props.disabled}
						required={true} />
					
					<input 
						className="databaseSchemaSubmit" 
						type="submit" 
						value={(this.props.isSaving) ? "Saving..." : "Add Database Schema"}
						disabled={disableSubmitButton} />
					<button 
						className="databaseSchemaCancel" 
						onClick={this.cancelHandler.bind(this)}
						disabled={this.props.disabled} >
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
	disabled: PropTypes.bool,
	isSaving: PropTypes.bool
};

export default AddDatabaseForm;