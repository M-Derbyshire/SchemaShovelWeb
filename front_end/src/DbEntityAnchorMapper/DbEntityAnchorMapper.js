import EntityElementIdGenerator from '../EntityElementIdGenerator/EntityElementIdGenerator';


//Returned "anchor objects" will have the below properties:
// - anchor: this is the element ID for the entity
// - label: this is label text for listing anchors
// - isMatch: was this entity a match to a filter
// - entityID: the ID in the entity object
// - entityType: the name of the entity type ("schema"; "table"; "column")

/** 
* Used to create arrays of "anchor objects" from an array of schema objects (from a FilterableSchemaList 
* instance). These anchor objects are used to create anchor tags that take you to the individual entity records 
* on a page. Each object will have these properties: 
* 
* "anchor" (the HTML element ID for the entity); 
* "label" (anchor tag text for the entity); 
* "isMatch" (was this entity a match to a filter?); 
* "entityID" (the ID in the entity object); 
* "entityType" (the name of the entity type -- "schema"/"table"/"column")
*/
class DbEntityAnchorMapper
{
	/** Create a new DbEntityAnchorMapper instance */
	constructor()
	{
		this.idGenerator = new EntityElementIdGenerator();
		
		this.idGeneratorLayerMethods = [
			"getIdForSchema",
			"getIdForTable",
			"getIdForColumn"
		];
		
		this.layerEntityTypes = [
			"schema",
			"table",
			"column"
		];
	}
	
	/**
	* Map an array of Schemas (and their inner entities) to anchor objects
	* @param {array} schemaList - The array of schemas
	* @return {array} An array of anchor objects for the given schemas, and their inner entities
	 */
	map(schemaList)
	{
		return this._mapEntityListForLayer(schemaList, 0, "");
	}
	
	/**
	* Creates an anchor object for the given table object (ignoring its inner entities). This is useful 
	* for mapping the subject table of an FK filter
	* @param {object} table - The table object that we need an achor object for
	* @param {string} schemaLabel - The label property of the parent schema's anchor object
	* @return {object} The anchor object for the given table
	 */
	mapSingleTable(table, schemaLabel)
	{
		return this._mapEntityListForLayer([table], 1, schemaLabel)[0];
	}
	
	//entityList is the list of entities
	//layer is the layer number (so schemas is 0; tables is 1; columns is 2)
	//outLayerLabel is the label of the entity that contains this entity
	/**
	* Map an array of entities (and their inner entities) to anchor objects
	* @param {array} entityList - An array of entity objects (from a FilterableSchemaList instance)
	* @param {number} layer - The entity layer of these entities (0 = schemas; 1 = tables; 2 = columns)
	* @param {string} outerLayerLabel - The label of the parent entity of this entity list (so for an array 
	* of tables, it would be the label for their parent schema)
	 */
	_mapEntityListForLayer(entityList, layer, outerLayerLabel)
	{
		if(layer >= this.idGeneratorLayerMethods.length || layer >= this.layerEntityTypes.length || layer < 0)
			return [];
		
		const layerMethod = this.idGeneratorLayerMethods[layer];
		let anchors = [];
		
		entityList.forEach(entity => {
			
			const newAnchor = {
				anchor: this.idGenerator[layerMethod](entity.id, entity.name),
				isMatch: entity.isMatch,
				label: ((outerLayerLabel !== "") ? `${outerLayerLabel}.` : "") + entity.name,
				entityID: entity.id,
				entityType: this.layerEntityTypes[layer]
			};
			
			anchors.push(newAnchor);
			anchors.push(
				...this._mapEntityListForLayer(entity.childEntities, layer + 1, newAnchor.label)
			);
		});
		
		return anchors;
	}
}

export default DbEntityAnchorMapper;