/** Used to generate a unique ID for a given entity object (from a FilterableSchemaList instance). 
These can be used as HTML element IDs */
class EntityElementIdGenerator
{
	/**
	* Generate an ID for a schema object
	* @param {number} schemaID - The ID from the schema entity object
	* @param {string} schemaName - The name of the schema
	* @return {string} The generated ID
	 */
	getIdForSchema(schemaID, schemaName)
	{
		return this._getIdForEntity(schemaID, schemaName, "schema");
	}
	
	/**
	* Generate an ID for a table object
	* @param {number} tableID - The ID from the table entity object
	* @param {string} tableName - The name of the table
	* @return {string} The generated ID
	 */
	getIdForTable(tableID, tableName)
	{
		return this._getIdForEntity(tableID, tableName, "table");
	}
	
	/**
	* Generate an ID for a column object
	* @param {number} columnID - The ID from the column entity object
	* @param {string} columnName - The name of the column
	* @return {string} The generated ID
	 */
	getIdForColumn(columnID, columnName)
	{
		return this._getIdForEntity(columnID, columnName, "column");
	}
	
	
	/**
	* Generate an ID for an entity object
	* @param {number} id - The ID from the entity object
	* @param {string} name - The name of the entity
	* @return {string} The generated ID
	 */
	_getIdForEntity(id, name, entityType)
	{
		return `${entityType}:${id}_${name}`;
	}
}

export default EntityElementIdGenerator;