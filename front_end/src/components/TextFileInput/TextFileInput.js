import React, { Component } from 'react';
import './TextFileInput.css';
import PropTypes from 'prop-types';

/**
* Provides a textarea element, that can also be populated with text from a file, via a file input element
*
*@component
 */
class TextFileInput extends Component
{	
	/**
	* Runs when the textarea value is changed, and passes the value on to this.props.setFileText()
	* @param {object} e - The standard onChange event parameter
	 */
	textAreaOnChange(e)
	{
		this.props.setFileText(e.target.value);
	}
	
	/**
	* Handles the file input element onChange event. Gets the data from the file (or passes an error to 
	* this.props.onErrorHandler) and puts that text data into the textarea element
	* @param {object} e - The standard onChange event parameter
	 */
	fileInputOnChange(e)
	{
		const fileReader = new FileReader();
		fileReader.onload = (fileReadEvent) => this.props.setFileText(fileReadEvent.target.result);
		
		try
		{
			fileReader.readAsText(e.target.files[0]);
		}
		catch(err)
		{
			this.props.onErrorHandler(err.message);
		}
	}
	
	/** Render a TextFileInput */
	render()
	{
		const textAreaValue = (this.props.fileText) ? this.props.fileText : "";
		
		return (
			<div className="TextFileInput">
				<textarea 
					className="TextFileTextArea"
					placeholder="Schema JSON" 
					onChange={this.textAreaOnChange.bind(this)} 
					value={textAreaValue}
					disabled={this.props.disabled}
					required={this.props.required} >
				</textarea>
				
				<input
					type="file"
					className="TextFileFileInput"
					onChange={this.fileInputOnChange.bind(this)}
					disabled={this.props.disabled} />
			</div>
		);
	}
}

TextFileInput.propTypes = {
	/**
	* The text for the textarea element
	 */
	fileText: PropTypes.string,
	
	/**
	* A function that sets the text for the textarea element
	* @param {string} text - The new text value
	 */
	setFileText: PropTypes.func.isRequired,
	
	/**
	* A function used to handle errors.
	* @param {string} error - The error message
	 */
	onErrorHandler: PropTypes.func.isRequired,
	
	/**
	* Is this input disabled?
	 */
	disabled: PropTypes.bool,
	
	/**
	* Is this input's value required, or can it be left empty?
	 */
	required: PropTypes.bool
};

export default TextFileInput;