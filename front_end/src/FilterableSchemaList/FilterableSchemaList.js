export default class FilterableSchemaList {
	
	constructor(schemaList, schemaColor, tableColor, columnColor)
	{
		this._schemaColor = schemaColor;
		this._tableColor = tableColor;
		this._columnColor = columnColor;
		
		this._fullList = this._reshapeEntities(schemaList);
	}
	
	get schemaColor() {return this._schemaColor;}
	get tableColor() {return this._tableColor;}
	get columnColor() {return this._columnColor;}
	
	getFullList()
	{
		return this._fullList;
	}
	
	_reshapeEntities(schemaList)
	{
		return schemaList.map((schema, index) => {
			
			//Will throw if anything is missing
			this._throwIfEntityMissingRequiredProperties(schema, [
				"name",
				"description",
				"tables"
			], "schema", index);
			
			this._throwIfEntityChildListIsNotArray(schema, "tables", "schema", index);
			
			const newSchema = {...schema};
			
			newSchema.childEntities = newSchema.tables.map((table) => {
				
				this._throwIfEntityMissingRequiredProperties(table, [
					"name",
					"description",
					"columns"
				], "table", index);
				
				this._throwIfEntityChildListIsNotArray(table, "columns", "table", index);
				
				const newTable = {...table};
				newTable.childEntities = newTable.columns.map(
					(column) => {
						this._throwIfEntityMissingRequiredProperties(column, [
							"name",
							"description"
						], "column", index);
						return this._addNewPropertiesToEntity({...column}, this._columnColor);
					}
				);
				
				delete newTable.columns;
				this._addNewPropertiesToEntity(newTable, this._tableColor);
				
				return newTable;
			});
			
			delete newSchema.tables;
			this._addNewPropertiesToEntity(newSchema, this._schemaColor);
			
			return newSchema;
		});
	}
	
	_throwIfEntityMissingRequiredProperties(entity, propNames, entityType, index)
	{
		propNames.forEach(propName => {
			if(!entity.hasOwnProperty(propName)) 
				throw new Error(`Error while processing list of schemas: at index ${index} in the schema array, there is a ${entityType} that did not include the '${propName}' property`);
		});
	}
	
	_throwIfEntityChildListIsNotArray(entity, childListName, entityType, index)
	{
		if(!Array.isArray(entity[childListName]))
			throw new Error(`Error while processing list of schemas: at index ${index} in the schema array, there is a '${childListName}' property of a ${entityType} that was not an array`);
	}
	
	_addNewPropertiesToEntity(entity, color, isMatch = false)
	{
		entity.isMatch = isMatch;
		entity.color = color;
		return entity; //Useful if we're using this as a map callback
	}
	
	
	
	
	
	
	getFilteredList(schemaFilterText, tableFilterText, columnFilterText, includeDescriptionText = false)
	{
		//To get the effect we want (isMatch being set, but returning all inner-entities when their outer
		//entity is a match), it is necessary to loop over the list twice.
		const listWithMatchesSet = this._getListWithIsMatchSet(
			schemaFilterText, tableFilterText, columnFilterText, includeDescriptionText
		);
		
		
		//Using reduce to create a new array, as we're modifying inner-arrays, 
		//but we don't want all items (which is what we'd get from map).
		//E.g. We may wan't every schema with matching tables, but only containing 
		//those matching tables (and the same is true for tables/columns).
		return listWithMatchesSet.reduce((resultSchemas, schema) => {
			
			if(schema.isMatch)
			{
				resultSchemas.push(schema);
			}
			else
			{
				const newSchema = {...schema};
				newSchema.childEntities = schema.childEntities.reduce((resultTables, table) => {
					
					if(table.isMatch)
					{
						resultTables.push(table);
					}
					else
					{
						const newTable = {...table};
						newTable.childEntities = table.childEntities.filter((column) => column.isMatch);
						if(newTable.childEntities.length > 0) resultTables.push(newTable);
					}
					
					return resultTables;
					
				}, []);
				
				if(newSchema.childEntities.length > 0) resultSchemas.push(newSchema);
			}
			
			return resultSchemas;
		}, []);
	}
	
	_getListWithIsMatchSet(schemaFilterText, tableFilterText, columnFilterText, includeDescriptionText = false)
	{
		return this._fullList.map(schema => {
			
			const newSchema = {...schema};
			
			newSchema.isMatch = 
				this._entityMatchesFilterText(newSchema, schemaFilterText, includeDescriptionText);
			
			newSchema.childEntities = newSchema.childEntities.map(table => {
				
				const newTable = {...table}; 
				
				newTable.isMatch = 
					this._entityMatchesFilterText(newTable, tableFilterText, includeDescriptionText);
				
				newTable.childEntities = newTable.childEntities.map(column => {
					const newColumn = {...column};
					newColumn.isMatch = 
						this._entityMatchesFilterText(column, columnFilterText, includeDescriptionText);
					return newColumn;
				});
				
				return newTable;
			});
			
			return newSchema;
		});
	}
	
	_entityMatchesFilterText(entity, filterText, includeDescriptionText = false)
	{
		//Empty filter text is not considered a match
		const textMatches = (text) => {
			return ((filterText !== "") && text.toLowerCase().includes(filterText));
		}
		
		return (textMatches(entity.name) || (includeDescriptionText && textMatches(entity.description)));
	}
	
	
	
	
	getForeignKeysToTable(targetTableID)
	{
		let targetTable;
		
		const filteredList = this._fullList.reduce((matchingSchemas, schema) => {
			
			const newSchema = {...schema};
			
			newSchema.childEntities = schema.childEntities.reduce((matchingTables, table) => {
				
				if(table.id === targetTableID)
				{
					targetTable = table;
					return matchingTables;
				}
				
				const fkColumns = table.childEntities.filter(
					column => (column.hasOwnProperty("fkToTableId") && column.fkToTableId === targetTableID)
				);
				
				if(fkColumns.length > 0)
					return [...matchingTables, {...table, isMatch: true}];
				else
					return matchingTables;
			}, []);
			
			if(newSchema.childEntities.length > 0)
					return [...matchingSchemas, newSchema];
				else
					return matchingSchemas;
		}, []);
		
		if(!targetTable)
			throw new Error(`Error while searching for foreign keys to a table: the target table does not exist`);
		
		return [targetTable, filteredList];
	}
}