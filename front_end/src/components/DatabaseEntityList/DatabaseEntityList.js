import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatabaseEntityList.css';
import EntityElementIdGenerator from '../../EntityElementIdGenerator/EntityElementIdGenerator';
import DatabaseEntity from '../DatabaseEntity/DatabaseEntity';

class DatabaseEntityList extends Component
{
	constructor(props)
	{
		super(props);
		
		this.state = {
			elemIdGenerator: new EntityElementIdGenerator(),
			entityLayerIdMethods: ["getIdForSchema", "getIdForTable", "getIdForColumn"],
			entityLayerEntityTypes: ["schemas", "tables", "columns"] //need to be plural, to match api paths
		};
	}
	
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
	
	//entity is the entity object itself.
	//layer is the index of the entities related ID generation method in elemIdGenerator
	//	(see this.state.entityLayerIdMethods)
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
					async (newDesc) => await updateEntityDescription(entityType, entity.id, newDesc)
				}
				saveDescriptionErrorHandler={()=>{}}
				descriptionCharLengthLimit={this.props.entityDescCharLimit}>
				
				{entity.childEntities && entity.childEntities.map((innerEntity) => {
					return this.mapEntityToComponent(innerEntity, layer + 1);
				})}
			</DatabaseEntity>
		);
	}
	
	
	
	
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
	
	apiAccessor: PropTypes.object,
	
	//An array of entity objects, to be displayed
	entityList: PropTypes.array.isRequired,
	
	//If an FK filter has been run, the entity for the table that is the subject 
	//of that search should be passed here
	subjectTableEntity: PropTypes.object,
	
	//An array of objects, representing labelling information for all table entities in the DB.
	//Each object should have a "label" and "entityID" property.
	//This is used when populating the "Foreign Key to" data of columns that have FK constraints
	tableLabels: PropTypes.array.isRequired,
	
	entityDescCharLimit: PropTypes.number.isRequired //The max length of an entity's description field
};

export default DatabaseEntityList;