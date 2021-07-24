export default class FilterableSchemaList {
	
	constructor(schemaList, schemaColor, tableColor, columnColor)
	{
		this._fullList = schemaList;
		this._schemaColor = schemaColor;
		this._tableColor = tableColor;
		this._columnColor = columnColor;
	}
	
	get schemaColor() {return this._schemaColor;}
	get tableColor() {return this._tableColor;}
	get columnColor() {return this._columnColor;}
	
	getFullList()
	{
		return this._fullList;
	}
	
	getFilteredList(schemaFilterText, tableFilterText, columnFilterText, includeDescriptionText = false)
	{
		
	}
	
	getForeignKeysToTable(tableID)
	{
		
	}
}