import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseEntityList.css';
import EntityElementIdGenerator from '../../EntityElementIdGenerator/EntityElementIdGenerator';
import DatabaseEntity from '../DatabaseEntity/DatabaseEntity';

/**
* Used to display a list of DatabaseEntity components (the list being provided by an instance of 
* FilterableSchemaList)
*
*@component
 */
class DatabaseEntityList extends Component
{
	/** Create a new instance of DatabaseEntityList */
	constructor(props)
	{
		super(props);
		
		this.state = {
			elemIdGenerator: new EntityElementIdGenerator(),
			entityLayerIdMethods: ["getIdForSchema", "getIdForTable", "getIdForColumn"],
			entityLayerEntityTypes: ["schemas", "tables", "columns"] //need to be plural, to match api paths
		};
	}
	
	/**
	* Maps the given schemas (from a FilterableSchemaList instance), and their child entities, to LI elements
	* @param {array} entities - An array of schemas, from a FilterableSchemaList instance
	* @param {boolean} firstIsSubjectEntity - Is the first entity in the passed array, actually a table (the 
	* table that is the subject of an FK filter)
	* @return {array} An array of JSX LI elements
	 */
	mapPassedSchemasToListItems(entities, firstIsSubjectEntity = false)
	{
		return entities.map((entity, index) => {
			const isSubject = (firstIsSubjectEntity && index === 0);
			return (
				<li key={index} className={(isSubject) ? "subjectEntityRecord" : ""}>
					{this.mapEntityToComponent(entity, (isSubject) ? 1 : 0)}
				</li>
			);
		});
	}
	
	
	/**
	* Maps a given entity (from a FilterableSchemaList instance) into a DatabaseEntity component
	* @param {object} entity - The entity to be mapped
	* @param {number} layer - The entity layer this entity is on (0 = schema; 1 = table; 2 = column)
	* @return {JSX} The DatabaseEntity component for the given entity
	 */
	mapEntityToComponent(entity, layer)
	{
		const apiAccessor = this.props.apiAccessor;
		const updateEntityDescription = (apiAccessor) ? 
									apiAccessor.updateEntityDescription.bind(apiAccessor) :
									async () => {};
		
		
		const entityType = this.state.entityLayerEntityTypes[layer];
		const elementID = 
			this.state.elemIdGenerator[this.state.entityLayerIdMethods[layer]](entity.id, entity.name);
		
		
		let fkTables;
		let fkString;
		if(entity.fkToTableId)
		{
			fkTables = this.props.tableLabels.filter(t => t.entityID === entity.fkToTableId);
			fkString = (fkTables.length > 0) ? fkTables[0].label : "Unable to identify table.";
		}
		
		return (
			<DatabaseEntity 
				key={elementID} //This needs to be added, as we're still creating a list in React's eyes
				elementID={elementID}
				name={entity.name}
				description={entity.description}
				color={entity.color}
				isMatch={entity.isMatch}
				fkToSchemaTableName={fkString}
				saveDescriptionChanges={
					async (newDesc) => {
						entity.description = newDesc; //If we don't do this, 
													//we can't filter with the new desc
						await updateEntityDescription(entityType, entity.id, newDesc);
					}
				}
				saveDescriptionErrorHandler={()=>{}}
				descriptionCharLengthLimit={this.props.entityDescCharLimit}>
				
				{entity.childEntities && entity.childEntities.map((innerEntity) => {
					return this.mapEntityToComponent(innerEntity, layer + 1);
				})}
			</DatabaseEntity>
		);
	}
	
	
	/** Render the DatabaseEntityList */
	render()
	{
		const firstIsSubjectEntity = !!this.props.subjectTableEntity;
		const entities = [];
		
		//Prefer doing it this was to using Array.unshift(), as this should be a little faster
		if(firstIsSubjectEntity)
			entities.push(this.props.subjectTableEntity);
		
		entities.push(...this.props.entityList)
		
		return (
			<div className="DatabaseEntityList">
				<ul>
					{this.mapPassedSchemasToListItems(entities, firstIsSubjectEntity)}
				</ul>
			</div>
		);
	}
}

DatabaseEntityList.propTypes = {
	/**
	* An instance of APIAccessor
	 */
	apiAccessor: PropTypes.object,
	
	/**
	* An array schemas, taken from an instance of FilterableSchemaList
	 */
	entityList: PropTypes.array.isRequired,
	
	/**
	* If an FK filter has been run, the entity for the table that is the subject 
	* of that search should be passed here
	 */
	subjectTableEntity: PropTypes.object,
	
	/**
	* An array of objects, representing labelling information for all table entities in the DB.
	* Each object should have a "label" and "entityID" property.
	* This is used when populating the "Foreign Key to" data of columns that have FK constraints
	 */
	tableLabels: PropTypes.array.isRequired,
	
	/**
	* The max length of entity description fields
	 */
	entityDescCharLimit: PropTypes.number.isRequired
};

export default DatabaseEntityList;