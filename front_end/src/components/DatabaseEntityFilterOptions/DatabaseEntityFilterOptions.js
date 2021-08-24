import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseEntityFilterOptions.css';

/**
* Provides an interface for filtering through the viewed 
* database entities
*
*@component
 */
class DatabaseEntityFilterOptions extends Component
{
	/** Render a new DatabaseEntityFilterOptions */
	constructor(props)
	{
		super(props);
		
		this.state = {
			...this.getClearedTextHandlerState(),
			...this.getClearedFKHandlerState(),
			includeDescriptionText: false
		};
	}
	
	/**
	* Handles the running of the text filter, with the values of the filter-text states
	 */
	runTextFilterHandler()
	{
		this.setState(this.getClearedFKHandlerState());
		this.props.runTextFilter(
			this.state.filterSchemaText, 
			this.state.filterTableText, 
			this.state.filterColumnText,
			this.state.includeDescriptionText
		);
	}
	
	/**
	* Provides an object with the filter-text properties, but reset to their cleared values (to be passed 
	* to setState())
	* @return {object} An object to be passed to setState(), in order to clear the text filter
	 */
	getClearedTextHandlerState()
	{
		return {
			filterSchemaText: "",
			filterTableText: "",
			filterColumnText: ""
		};
	}
	
	/**
	* Clears the text-filter
	 */
	clearTextFilter()
	{
		this.setState(this.getClearedTextHandlerState());
		this.props.runTextFilter("", "", "", this.state.includeDescriptionText);
	}
	
	/**
	* Handles the running of a Foreign Key filter
	 */
	runFKFilterHandler()
	{
		this.setState(this.getClearedTextHandlerState());
		this.props.runFkFilter(this.state.fkSelectedTableID);
	}
	
	/**
	* Provides an object with the FK filter properties, but reset to their cleared values (to be passed 
	* to setState())
	* @return {object} An object to be passed to setState(), in order to clear the FK filter
	 */
	getClearedFKHandlerState()
	{
		return {
			fkSelectedSchemaID: -1,
			fkSelectedTableID: -1
		};
	}
	
	/**
	* Clears the FK filter
	 */
	clearFKFilter()
	{
		this.setState(this.getClearedFKHandlerState());
		this.props.runTextFilter("", "", "", this.state.includeDescriptionText);
	}
	
	/**
	* Maps the this.props.schemas array into a list of JSX option elements (with the schema ID and name).
	* Used to generate options for the schema select list in the FK filter
	* @return {array} An array of JSX option tags, for each schema
	 */
	schemaSelectOptionsMapper()
	{
		return this.props
			.schemas.map((schema, i) => (<option value={schema.id} key={i}>{schema.name}</option>));
	}
	
	/**
	* Maps the tables for the selected FK-search into a list of JSX option elements (with the table 
	* ID and name). Used to generate options for the table select list in the FK filter (after a schema 
	* has been selected)
	* @return {array} An array of JSX option tags, for each table in the selected schema
	 */
	tableSelectOptionsMapper()
	{
		const schemaID = this.state.fkSelectedSchemaID;
		
		if(schemaID < 0)
			return;
		
		const tableList = this.props.schemas.filter(s => s.id === schemaID)[0].childEntities;
		
		return tableList.map((table, i) => (<option value={table.id} key={i}>{table.name}</option>));
	}
	
	/** Render the DatabaseEntityFilterOptions */
	render()
	{
		return (
			<div className="DatabaseEntityFilterOptions">
				
				<hr/>
				
				<div className="FilterOptionsRow textFilterOptions">
					
					<div className="FilterOptionsControl">
						<label>Schema Filter: </label>
						<input type="text" className="textFilterInput schemaTextFilterInput" size="10"
							value={this.state.filterSchemaText} 
							onChange={(e) => this.setState({ filterSchemaText: e.target.value })} />
					</div>
					
					<div className="FilterOptionsControl">
						<label>Table Filter: </label>
						<input type="text" className="textFilterInput tableTextFilterInput" size="10"
							value={this.state.filterTableText} 
							onChange={(e) => this.setState({ filterTableText: e.target.value })} />
					</div>
					
					<div className="FilterOptionsControl">
						<label>Column Filter: </label>
						<input type="text" className="textFilterInput columnTextFilterInput" size="10"
							value={this.state.filterColumnText} 
							onChange={(e) => this.setState({ filterColumnText: e.target.value })} />
					</div>
					
					<div className="FilterOptionsControl">
						<label>Include description text in filter? </label>
						<input type="checkBox" className="descFilterCheckbox"
							checked={this.state.includeDescriptionText} 
							onChange={(e) => this.setState({ includeDescriptionText: e.target.checked })} />
					</div>
					
					<div className="FilterOptionsControl filterOptionsControlBtns">
						<button onClick={this.runTextFilterHandler.bind(this)} className="textFilterRunBtn">
							Filter
						</button>
						<button onClick={this.clearTextFilter.bind(this)} className="textFilterClearBtn">
							Clear
						</button>
					</div>
				</div>
				
				<hr/>
				
				<div className="FilterOptionsRow fkFilterOptions">
					<h2>Find Foreign Keys of: </h2>
					
					<div className="FilterOptionsControl">
						<label>Schema: </label>
						<select value={this.state.fkSelectedSchemaID} onChange={(e) => this.setState({
							fkSelectedSchemaID: Number(e.target.value),
							fkSelectedTableID: -1
						})} className="fkEntitySelect fkSchemaSelect">
							<option value="-1"></option>
							{this.schemaSelectOptionsMapper.apply(this)}
						</select>
					</div>
					
					<div className="FilterOptionsControl">
						<label>Table: </label>
						<select value={this.state.fkSelectedTableID} onChange={(e) => this.setState({
							fkSelectedTableID: Number(e.target.value)
						})} className="fkEntitySelect fkTableSelect">
							<option value="-1"></option>
							{this.tableSelectOptionsMapper.apply(this)}
						</select>
					</div>
					
					<div className="FilterOptionsControl filterOptionsControlBtns">
						<button 
							onClick={this.runFKFilterHandler.bind(this)}
							disabled={this.state.fkSelectedTableID < 0} 
							className="fkFilterRunBtn" >Find</button>
							
						<button onClick={this.clearFKFilter.bind(this)}
							className="fkFilterClearBtn">Clear</button>
					</div>
				</div>
			</div>
		);
	}
}

DatabaseEntityFilterOptions.propTypes = {
	/**
	* Should be an array of schemas, from a FilterableSchemaList method (or an empty array if these 
	* have not yet been retrieved) 
	 */
	schemas: PropTypes.array.isRequired,
	
	/**
	* A function that will run the text filter
	* @param {string} schemaFilterText - The filter text for schema names/descriptions | 
	* @param {string} tableFilterText - The filter text for table names/descriptions | 
	* @param {string} columnFilterText - The filter text for column names/descriptions | 
	* @param {boolean} includeDescriptionText - Should descriptions be included in the filter? 
	 */
	runTextFilter: PropTypes.func.isRequired,
	
	//Should take the target table ID as a parameter
	/**
	* A function that will run the FK filter, to find tables that have Foreign Keys to the given table
	* @param {number} tableID - The table ID of the subject table
	 */
	runFkFilter: PropTypes.func.isRequired
};

export default DatabaseEntityFilterOptions;