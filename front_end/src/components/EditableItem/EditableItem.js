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
		
		this.props.saveChanges(this.state.currentText);
		
		this.setState({
			isSavingChanges: true
		});
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
								maxLength={(this.state.textLengthLimit > -1) ? 
												this.state.textLengthLimit : 
												undefined} />);
		
		//The button has 3 uses: "edit" (enter editing mode), "save" and "saving".
		//There is also a cancel button, when editing, to exit without saving.
		let buttonText, buttonOnClick, buttonDisabled = false;
		let cancelButtonVisible = false;
		if(this.state.isInEditMode)
		{
			if(this.state.isSavingChanges)
			{
				buttonText = "Saving...";
				buttonDisabled = true;
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
		const buttonElem =  (<button onClick={buttonOnClick} disabled={buttonDisabled}
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
	saveChanges: PropTypes.func.isRequired,
	textLengthLimit: PropTypes.number,
}

export default EditableItem;