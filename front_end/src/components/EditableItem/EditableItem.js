import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './EditableItem.css';



class EditableItem extends Component
{
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
	
	toggleEditMode()
	{
		this.setState({
			isInEditMode: !this.state.isInEditMode
		});
	}
	
	textChange(e)
	{
		this.setState({
			currentText: e.target.value
		});
	}
	
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
			.catch((err) => this.props.saveErrorHandler(err));
	}
	
	cancelChanges(e)
	{
		e.stopPropagation();
		
		this.toggleEditMode();
		
		this.setState({
			currentText: this.state.savedText
		});
	}
	
	render()
	{
		//If we are in editing mode, things need to be displayed differently
		const textElem = (!this.state.isInEditMode) ? 
							(<span className="EIStaticText">{this.state.currentText}</span>) :
							(<input className="EITextInput" type="text" value={this.state.currentText} 
								onChange={(e) => this.textChange(e)} 
								disabled={this.state.isSavingChanges}
								maxLength={(this.state.textLengthLimit > -1) ? 
												this.state.textLengthLimit : 
												undefined} />);
		
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
		const buttonElem =  (<button onClick={buttonOnClick} disabled={this.state.isSavingChanges}
									className={this.state.isInEditMode ? "EISaveButton" : "EIEditButton"} >
									{buttonText}</button>);
		
		const cancelButtonElem = (<button className="EICancelChangeButton" 
									onClick={(e) => this.cancelChanges(e)}>Cancel</button>);
		
		return (
			<div className="EditableItem">
				<span className="EITextArea">{textElem}</span>
				<span className="EIButtonArea">{buttonElem} {cancelButtonVisible && cancelButtonElem}</span>
			</div>
		);
	}
}

EditableItem.propTypes = {
	text: PropTypes.string,
	saveChanges: PropTypes.func.isRequired, //Asynchronus function. Takes one parameter (the new text to be saved)
	saveErrorHandler: PropTypes.func.isRequired, //Takes one parameter (the error)
	textLengthLimit: PropTypes.number,
}

export default EditableItem;