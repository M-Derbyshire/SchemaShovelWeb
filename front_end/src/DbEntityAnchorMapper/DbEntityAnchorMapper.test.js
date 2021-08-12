import DbEntityAnchorMapper from './DbEntityAnchorMapper';
import EntityElementIdGenerator from '../EntityElementIdGenerator/EntityElementIdGenerator';

const bareTestSchemas = [
	{ id: 1, name: "aSchema", isMatch: false, childEntities: [
		{ id: 1, name: "aTable", isMatch: false, childEntities: [
			{ id: 1, name: "aColumn", isMatch: false }
		]}
	]},
	{ id: 2, name: "aSchema", isMatch: true, childEntities: [
		{ id: 2, name: "aTable", isMatch: true, childEntities: [
			{ id: 2, name: "aColumn", isMatch: true }
		]}
	]}
];

test("map method will use the right EntityElementIdGenerator method for the entity layer to generate the anchor text", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const result = mapper.map(bareTestSchemas);
	
	//Schemas
	let entity = bareTestSchemas[0];
	let resultEntity = result[0];
	expect(resultEntity.anchor).toEqual(idGenerator.getIdForSchema(entity.id, entity.name));
	entity = bareTestSchemas[1];
	resultEntity = result[3];
	expect(resultEntity.anchor).toEqual(idGenerator.getIdForSchema(entity.id, entity.name));
	
	//Tables
	entity = bareTestSchemas[0].childEntities[0];
	resultEntity = result[1];
	expect(resultEntity.anchor).toEqual(idGenerator.getIdForTable(entity.id, entity.name));
	entity = bareTestSchemas[1].childEntities[0];
	resultEntity = result[4];
	expect(resultEntity.anchor).toEqual(idGenerator.getIdForTable(entity.id, entity.name));
	
	//Columns
	entity = bareTestSchemas[0].childEntities[0].childEntities[0];
	resultEntity = result[2];
	expect(resultEntity.anchor).toEqual(idGenerator.getIdForColumn(entity.id, entity.name));
	entity = bareTestSchemas[1].childEntities[0].childEntities[0];
	resultEntity = result[5];
	expect(resultEntity.anchor).toEqual(idGenerator.getIdForColumn(entity.id, entity.name));
});

//As in, a column's label would be: theSchema.theTable.theColumn
test("map will return the labels with the outer entities pre-pended to the string with periods", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const testSchema = bareTestSchemas[0];
	const testTable = testSchema.childEntities[0];
	const testColumn = testTable.childEntities[0];
	testSchema.isMatch = false;
	testTable.isMatch = false;
	testColumn.isMatch = false;
	
	const result = mapper.map([testSchema]);
	
	expect(result[0].label).toEqual(testSchema.name);
	expect(result[1].label).toEqual(`${testSchema.name}.${testTable.name}`);
	expect(result[2].label).toEqual(`${testSchema.name}.${testTable.name}.${testColumn.name}`);
});

test("map will correctly set the isMatch property of the anchor objects", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const result = mapper.map(bareTestSchemas);
	
	expect(result[0].isMatch).toBeFalsy();
	expect(result[1].isMatch).toBeFalsy();
	expect(result[2].isMatch).toBeFalsy();
	expect(result[3].isMatch).toBeTruthy();
	expect(result[4].isMatch).toBeTruthy();
	expect(result[5].isMatch).toBeTruthy();
});