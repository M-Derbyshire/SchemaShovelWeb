import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseEntityFilterOptions.css';

class DatabaseEntityFilterOptions extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			...this.getClearedTextHandlerState(),
			...this.getClearedFKHandlerState(),
			includeDescriptionText: false
		};
	}
	
	
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
	
	getClearedTextHandlerState()
	{
		return {
			filterSchemaText: "",
			filterTableText: "",
			filterColumnText: ""
		};
	}
	
	clearTextFilter()
	{
		this.setState(this.getClearedTextHandlerState());
		this.props.runTextFilter("", "", "", this.state.includeDescriptionText);
	}
	
	runFKFilterHandler()
	{
		this.setState(this.getClearedTextHandlerState());
		this.props.runFkFilter(this.state.fkSelectedTableID);
	}
	
	getClearedFKHandlerState()
	{
		return {
			fkSelectedSchemaID: -1,
			fkSelectedTableID: -1
		};
	}
	
	clearFKFilter()
	{
		this.setState(this.getClearedFKHandlerState());
		this.props.runFkFilter(-1);
	}
	
	
	schemaSelectOptionsMapper()
	{
		return this.props
			.schemas.map((schema, i) => (<option value={schema.id} key={i}>{schema.name}</option>));
	}
	
	tableSelectOptionsMapper()
	{
		const schemaID = this.state.fkSelectedSchemaID;
		
		if(schemaID < 0)
			return;
		
		const tableList = this.props.schemas.filter(s => s.id === schemaID)[0].childEntities;
		
		return tableList.map((table, i) => (<option value={table.id} key={i}>{table.name}</option>));
	}
	
	render()
	{
		return (
			<div className="DatabaseEntityFilterOptions">
				
				<hr/>
				
				<div className="FilterOptionsRow textFilterOptions">
					
					<div className="FilterOptionsControl">
						<label>Schema Filter: </label>
						<input type="text" className="textFilterInput" size="10"
							value={this.state.filterSchemaText} 
							onChange={(e) => this.setState({ filterSchemaText: e.target.value })} />
					</div>
					
					<div className="FilterOptionsControl">
						<label>Table Filter: </label>
						<input type="text" className="textFilterInput" size="10"
							value={this.state.filterTableText} 
							onChange={(e) => this.setState({ filterTableText: e.target.value })} />
					</div>
					
					<div className="FilterOptionsControl">
						<label>Column Filter: </label>
						<input type="text" className="textFilterInput" size="10"
							value={this.state.filterColumnText} 
							onChange={(e) => this.setState({ filterColumnText: e.target.value })} />
					</div>
					
					<div className="FilterOptionsControl">
						<label>Include description text in filter? </label>
						<input type="checkBox" className="descFilterCheckbox"
							checked={this.state.includeDescriptionText} 
							onChange={(e) => this.setState({ includeDescriptionText: e.target.checked })} />
					</div>
					
					<div className="FilterOptionsControl">
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
					
					<div className="FilterOptionsControl">
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
	
	//Required, but can be an empty list if not yet retrieved.
	//Should be an array of schemas, from a FilterableSchemaList method
	schemas: PropTypes.array.isRequired,
	
	//Should take 4 params: schemaFilterText, tableFilterText, columnFilterText, includeDescriptionText
	runTextFilter: PropTypes.func.isRequired,
	
	//Should take the target table ID as a parameter
	runFkFilter: PropTypes.func.isRequired
};

export default DatabaseEntityFilterOptions;