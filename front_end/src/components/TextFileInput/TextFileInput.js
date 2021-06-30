import React, { Component } from 'react';
import './TextFileInput.css';
import PropTypes from 'prop-types';

class TextFileInput extends Component
{	
	textAreaOnChange(e)
	{
		this.props.setFileText(e.target.value);
	}
	
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
					disabled={this.props.disabled} >
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
	fileText: PropTypes.string,
	setFileText: PropTypes.func.isRequired,
	onErrorHandler: PropTypes.func.isRequired, //Should be a function that takes the error text
	disabled: PropTypes.bool
};

export default TextFileInput;