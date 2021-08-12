import EntityElementIdGenerator from '../EntityElementIdGenerator/EntityElementIdGenerator';

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
	}
	
	map(entityList)
	{
		return this._mapEntityListForLayer(entityList, 0, "");
	}
	
	//entityList is the list of entities
	//layer is the layer number (so schemas is 0; tables is 1; columns is 2)
	//outLayerLabel is the label of the entity that contains this entity
	_mapEntityListForLayer(entityList, layer, outerLayerLabel)
	{
		if(layer >= this.idGeneratorLayerMethods.length || layer < 0)
			return [];
		
		const layerMethod = this.idGeneratorLayerMethods[layer];
		let anchors = [];
		
		entityList.forEach(entity => {
			
			const newAnchor = {
				anchor: this.idGenerator[layerMethod](entity.id, entity.name),
				isMatch: entity.isMatch,
				label: ((outerLayerLabel !== "") ? `${outerLayerLabel}.` : "") + entity.name
			};
			
			anchors.push(newAnchor);
			anchors.push(
				...this._mapEntityListForLayer(entity.childEntities, layer + 1, newAnchor.label)
			);
		});
		
		return anchors;
	}
}