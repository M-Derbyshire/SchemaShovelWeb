export default class EntityElementIdGenerator
{
	getIdForSchema(schemaID, schemaName)
	{
		return this._getIdForEntity(schemaID, schemaName, "schema");
	}
	
	getIdForTable(tableID, tableName)
	{
		return this._getIdForEntity(tableID, tableName, "table");
	}
	
	getIdForColumn(columnID, columnName)
	{
		return this._getIdForEntity(columnID, columnName, "column");
	}
	
	
	
	_getIdForEntity(id, name, entityType)
	{
		return `${entityType}:${id}_${name}`;
	}
}