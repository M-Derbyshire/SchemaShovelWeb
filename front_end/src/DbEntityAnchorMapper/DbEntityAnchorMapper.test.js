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
	
	const result = mapper.map([testSchema]);
	
	expect(result[0].label).toEqual(testSchema.name);
	expect(result[1].label).toEqual(`${testSchema.name}.${testTable.name}`);
	expect(result[2].label).toEqual(`${testSchema.name}.${testTable.name}.${testColumn.name}`);
});

test("map will correctly set the isMatch, entityID and entityType properties of the anchor objects", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const result = mapper.map(bareTestSchemas);
	
	expect(result[0].isMatch).toBeFalsy();
	expect(result[1].isMatch).toBeFalsy();
	expect(result[2].isMatch).toBeFalsy();
	expect(result[3].isMatch).toBeTruthy();
	expect(result[4].isMatch).toBeTruthy();
	expect(result[5].isMatch).toBeTruthy();
	
	expect(result[0].entityID).toBe(1);
	expect(result[1].entityID).toBe(1);
	expect(result[2].entityID).toBe(1);
	expect(result[3].entityID).toBe(2);
	expect(result[4].entityID).toBe(2);
	expect(result[5].entityID).toBe(2);
	
	expect(result[0].entityType).toEqual("schema");
	expect(result[1].entityType).toEqual("table");
	expect(result[2].entityType).toEqual("column");
	expect(result[3].entityType).toEqual("schema");
	expect(result[4].entityType).toEqual("table");
	expect(result[5].entityType).toEqual("column");
});



test("mapSingleTable method will use the right EntityElementIdGenerator method for tables to generate the anchor text", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const subject = bareTestSchemas[0].childEntities[0];
	const result = mapper.mapSingleTable(subject, "");
	
	expect(result.anchor).toEqual(idGenerator.getIdForTable(subject.id, subject.name));
});


test("mapSingleTable will return the labels with the outer schema pre-pended to the string with a period", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const schemaLabel = bareTestSchemas[0].name;
	const subject = bareTestSchemas[0].childEntities[0];
	const result = mapper.mapSingleTable(subject, schemaLabel);
	
	expect(result.label).toEqual(`${schemaLabel}.${subject.name}`);
});

test("mapSingleTable will correctly set the isMatch property of the anchor objects", () => {
	
	const mapper = new DbEntityAnchorMapper();
	const idGenerator = new EntityElementIdGenerator();
	
	const schemaLabel1 = bareTestSchemas[0].name;
	const subject1 = bareTestSchemas[0].childEntities[0];
	const result1 = mapper.mapSingleTable(subject1, schemaLabel1);
	
	expect(result1.isMatch).toBeFalsy();
	
	const schemaLabel2 = bareTestSchemas[1].name;
	const subject2 = bareTestSchemas[1].childEntities[0];
	const result2 = mapper.mapSingleTable(subject2, schemaLabel2);
	
	expect(result2.isMatch).toBeTruthy();
});