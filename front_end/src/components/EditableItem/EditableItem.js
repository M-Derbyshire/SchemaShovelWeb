import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditableItem.css';

/**
* Displays the given text, but also provides a way for the user to edit the text, and save the new value
*
*@component
 */
class EditableItem extends Component
{
	/** Create a new EditableItem instance */
	constructor(props)
	{
		super(props);
		
		const savedText = (props.text) ? props.text : "";
		
		this.state = {
			isInEditMode: false,
			isSavingChanges: false,
			textLengthLimit: (props.textLengthLimit) ? props.textLengthLimit : -1,
			savedText, 
			currentText: savedText, //The current text of the item (may not have been saved yet)
		};
	}
	
	/** This switches the component's mode, between editing and not-editing */
	toggleEditMode()
	{
		this.setState({
			isInEditMode: !this.state.isInEditMode
		});
	}
	
	/** This sets the state for the current text, whenever it is changed during editing */
	textChange(e)
	{
		this.setState({
			currentText: e.target.value
		});
	}
	
	/** This handles the saving of the new text, once it has been edited */
	saveChanges(e)
	{
		e.stopPropagation();
		
		this.setState({
			isSavingChanges: true
		});
		
		this.props.saveChanges(this.state.currentText)
			.then(() => {
				this.setState({
					isSavingChanges: false,
					isInEditMode: false,
					savedText: this.state.currentText
				});
			})
			.catch((err) => {
				this.setState({
					isSavingChanges: false,
					isInEditMode: false,
					currentText: this.state.savedText
				});
				this.props.saveErrorHandler(err);
			});
	}
	
	/** This allows the user to cancel their changes to the text */
	cancelChanges(e)
	{
		e.stopPropagation();
		
		this.toggleEditMode();
		
		this.setState({
			currentText: this.state.savedText
		});
	}
	
	/** Render an EditableItem */
	render()
	{
		//If we are in editing mode, things need to be displayed differently
		
		//The button has 3 uses: "edit" (enter editing mode), "save" and "saving".
		//There is also a cancel button, when editing, to exit without saving.
		let buttonText, buttonOnClick;
		let cancelButtonVisible = false;
		if(this.state.isInEditMode)
		{
			if(this.state.isSavingChanges)
			{
				buttonText = "Saving...";
			}
			else
			{
				cancelButtonVisible = true;
				buttonText = "Save";
				buttonOnClick = (e) => this.saveChanges(e);
			}
		}
		else
		{
			buttonText = "Edit";
			buttonOnClick = () => this.toggleEditMode();
		}
		
		return (
			<div className="EditableItem">
				<span className="EITextArea">
					
					{!this.state.isInEditMode && <span className="EIStaticText">{this.state.savedText}</span>}
					{this.state.isInEditMode && <input className="EITextInput" type="text" value={this.state.currentText} 
								onChange={(e) => this.textChange(e)} 
								disabled={this.state.isSavingChanges}
								size={1} //Without allowing the input to get really small, upto the min-width,
										// the flexbox styling doesn't wrap
								maxLength={(this.state.textLengthLimit > -1) ? 
												this.state.textLengthLimit : 
												undefined} />}
					
				</span>
				
				<span className="EIButtonArea">
					
					<button onClick={buttonOnClick} disabled={this.state.isSavingChanges}
										className={this.state.isInEditMode ? "EISaveButton" : "EIEditButton"} >
										{buttonText}</button>
					
					{cancelButtonVisible && <button className="EICancelChangeButton" 
												onClick={(e) => this.cancelChanges(e)}>Cancel</button>}
				</span>
			</div>
		);
	}
}

EditableItem.propTypes = {
	/**
	* The initial text for the element
	 */
	text: PropTypes.string,
	
	/**
	* An async function that will save the new text
	* @param {string} newValue - The new value for the text
	 */
	saveChanges: PropTypes.func.isRequired,
	
	/**
	* A fuction to call if there is an error
	* @param {string} error - The error message
	 */
	saveErrorHandler: PropTypes.func.isRequired,
	
	/**
	* The character limit of the text values
	 */
	textLengthLimit: PropTypes.number,
}

export default EditableItem;