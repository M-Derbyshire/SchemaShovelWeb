import EntityElementIdGenerator from '../EntityElementIdGenerator/EntityElementIdGenerator';


//Returned "anchor objects" will have the below properties:
// - anchor: this is the element ID for the entity
// - label: this is label text for listing anchors
// - isMatch: was this entity a match to a filter
// - entityID: the ID in the entity object
// - entityType: the name of the entity type ("schema"; "table"; "column")
export default class DbEntityAnchorMapper
{
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
	
	map(entityList)
	{
		return this._mapEntityListForLayer(entityList, 0, "");
	}
	
	//Useful for mapping the subject table of an FK filter.
	//Returns just the anchor for the table (no inner entities)
	//schemaLabel is the label of the entity that contains this entity
	mapSingleTable(table, schemaLabel)
	{
		return this._mapEntityListForLayer([table], 1, schemaLabel)[0];
	}
	
	//entityList is the list of entities
	//layer is the layer number (so schemas is 0; tables is 1; columns is 2)
	//outLayerLabel is the label of the entity that contains this entity
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