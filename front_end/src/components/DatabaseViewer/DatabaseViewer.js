import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseViewer.css';
import { withRouter } from 'react-router-dom';
import FilterableSchemaList from '../../FilterableSchemaList/FilterableSchemaList';
import DbEntityAnchorMapper from '../../DbEntityAnchorMapper/DbEntityAnchorMapper';
import DatabaseEntityFilterOptions from '../DatabaseEntityFilterOptions/DatabaseEntityFilterOptions';
import AnchorList from '../AnchorList/AnchorList';
import DatabaseEntityList from '../DatabaseEntityList/DatabaseEntityList';

/**
* Used to view and search through the entities within a database record.
*
*@component
 */
class DatabaseViewer extends Component
{
	
	/** Create a new DatabaseViewer instance */
	constructor(props)
	{
		super(props);
		
		const schemaColor = "#3bdbd9";
		const tableColor = "#db7e70";
		const columnColor = "#dbbb70";
		
		this.state = {
			dbName: null,
			dbSchemas: new FilterableSchemaList([], schemaColor, tableColor, columnColor),
			filteredList: [],
			fkFilterSubjectTable: null,
			fkFilterSchemaName: "",
			anchorMapper: new DbEntityAnchorMapper(),
			fullTableAnchorsList: [],
			hasFailedToLoad: false,
			schemaColor: schemaColor,
			tableColor: tableColor,
			columnColor: columnColor
		};
	}
	
	/** Returns the user to the homepage */
	returnToMenu()
	{
		this.props.history.push("/");
	}
	
	/**
	* Starts the retrieval of the database record, once an instance of APIAccessor has been provided 
	* as a prop
	 */
	startDatabaseRetrieval()
	{
		//this.props.match.params.* is not supported anymore
		const dbID = Number(window.location.pathname.split("/")[2]);
		
		//We may not have the apiAccessor yet (say, if the user goes directly to this route, 
		//rather than through the selection menu)
		if(this.state.dbName === null && this.props.apiAccessor && !this.state.hasFailedToLoad)
		{
			const schemaColor = this.state.schemaColor;
			const tableColor = this.state.tableColor;
			const columnColor = this.state.columnColor;
			
			this.props.apiAccessor.getDatabaseByID(dbID)
				.then((db) => {
					
					const filterableList = 
						new FilterableSchemaList(db.schemas, schemaColor, tableColor, columnColor);
					
					const filteredList = filterableList.getFullList();
					
					const tableAnchors = 
						this.state.anchorMapper.map(filteredList).filter(e => e.entityType === "table");
					
					this.setState({
						dbName: db.name,
						dbSchemas: filterableList,
						filteredList,
						fullTableAnchorsList: tableAnchors
					});
					
				}).catch((err) => {
					this.setState({
						hasFailedToLoad: true,
						dbName: null,
						dbSchemas: new FilterableSchemaList([], schemaColor, tableColor, columnColor),
						filterableList: [],
						fkFilterSubjectTable: null
					});
				});
		}
	}
	
	
	
	/** 
	* Runs a text filter against the database entity names (and possibly also thier descriptions). If the
	* given text values are blank, this acts as a complete clear of both the text and FK filters.
	* @param {string} schemaFilterText - The filter text for schema names/descriptions | 
	* @param {string} tableFilterText - The filter text for table names/descriptions | 
	* @param {string} columnFilterText - The filter text for column names/descriptions | 
	* @param {boolean} includeDescriptionText - Should descriptions be included in the filter? 
	*/
	runTextFilter(schemaFilterText, tableFilterText, columnFilterText, includeDescriptionText)
	{
		const newFilteredList = (!schemaFilterText && !tableFilterText && !columnFilterText) ?
			this.state.dbSchemas.getFullList() :
			this.state.dbSchemas.getFilteredList(
				schemaFilterText, 
				tableFilterText, 
				columnFilterText, 
				includeDescriptionText);
		
		this.setState({
			fkFilterSubjectTable: null,
			filteredList: newFilteredList
		});
	}
	
	/**
	* Runs a filter that finds tables with Foreign Keys to a given table
	* @param {number} tableID - The ID of the table that is the subject of the search
	 */
	runFkFilter(tableID)
	{
		const [subjectTable, subjectSchemaName, newFilteredList] = this.state.dbSchemas.getForeignKeysToTable(tableID);
		
		this.setState({
			fkFilterSubjectTable: subjectTable,
			fkFilterSchemaName: subjectSchemaName,
			filteredList: newFilteredList
		});
	}
	
	
	/**
	* Attempts to start the retrieval of the list of databases
	 */
	componentDidUpdate()
	{
		this.startDatabaseRetrieval();
	}
	
	/**
	* Attempts to start the retrieval of the list of databases
	 */
	componentDidMount()
	{
		this.startDatabaseRetrieval();
	}
	
	/**
	* Aborts any active fetch requests
	 */
	componentWillUnmount()
	{
		if(this.props.apiAccessor)
			this.props.apiAccessor.abortRequests();
	}
	
	
	
	
	/** Render the DatabaseViewer */
	render()
	{
		const anchorMapper = this.state.anchorMapper;
		
		const anchorObjects = anchorMapper.map(this.state.filteredList)
		const fkSubjectTableAnchor = (this.state.fkFilterSubjectTable) ? 
			anchorMapper.mapSingleTable(this.state.fkFilterSubjectTable, this.state.fkFilterSchemaName) :
			null;
		
		const hasFailedToLoad = this.state.hasFailedToLoad;
		const isLoading = (!hasFailedToLoad && !this.state.dbName);
		
		let titleText;
		if(isLoading) 
			titleText = "Loading...";
		else if(this.state.dbName)
			titleText = this.state.dbName;
		else
			titleText = "Error";
		
		return (
			<div className="DatabaseViewer">
				<header>
					<div className="dbViewerHeaderRow">
						<button className="dbViewerMenuBtn" onClick={this.returnToMenu.bind(this)}>
							Main Menu
						</button>
						<h1 className="dbViewerTitle">{titleText}</h1>
					</div>
					
					<div className="dbViewerHeaderRow">
						<DatabaseEntityFilterOptions 
							schemas={this.state.dbSchemas.getFullList()}
							runTextFilter={this.runTextFilter.bind(this)}
							runFkFilter={(this.runFkFilter.bind(this))} />
					</div>
				</header>
				
				<div className="dbViewerContentContainer">
					<AnchorList 
						anchorObjects={anchorObjects}
						fkSubjectTable={fkSubjectTableAnchor} />
					
					<DatabaseEntityList
						entityList={this.state.filteredList}
						subjectTableEntity={this.state.fkFilterSubjectTable}
						tableLabels={this.state.fullTableAnchorsList}
						entityDescCharLimit={this.props.entityDescCharLimit}
						apiAccessor={this.props.apiAccessor} />
				</div>
			</div>
		);
	}
}

DatabaseViewer.propTypes = {
	/**
	* An instance of APIAccessor (if this is undefined, a loading message will be displayed)
	 */
	apiAccessor: PropTypes.object,
	
	/**
	* The character limit for database entity descriptions
	 */
	entityDescCharLimit: PropTypes.number.isRequired //The character limit of entity descriptions
};

export default withRouter(DatabaseViewer);