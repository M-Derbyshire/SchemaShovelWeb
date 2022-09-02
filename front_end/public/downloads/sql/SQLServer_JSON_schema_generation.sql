/*
	MAKE SURE YOU ARE RUNNING THIS AGAINST THE CORRECT DATABASE
*/



-- We get the JSON for each schema, table and column.
-- Each record will begin with the comma (and then the first record's comma is removed when 
-- the JSON is generated)



-- Get the schemas
-- ----------------------------------------------------------------------------
SELECT 
	s.schema_id AS id,
	',{"name": "' + s.name + '", "description": "", "tables": [' AS JSONStart
INTO #schemaJSON
FROM sys.schemas AS s
ORDER BY s.schema_id;
-- ----------------------------------------------------------------------------



-- Get the tables
-- ----------------------------------------------------------------------------
SELECT
	t.object_id AS id,
	o.schema_id AS schema_id,
	',{"name": "' + t.name + '", "description": "", "columns": [' AS JSONStart
INTO #tableJSON
FROM sys.tables AS t
JOIN sys.objects AS o ON t.object_id = o.object_id
ORDER BY t.object_id;
-- ----------------------------------------------------------------------------




-- Get the columns
-- -------------------------------------------------------------------------------------------------------
SELECT
	c.column_id AS id,
	c.object_id AS table_id,
	
	',{"name": "' + c.name + '", ' + 
	
	-- Now add FK_to values for schema and table (if this is an FK).
	IIF(referenced_table.name IS NOT NULL, 
		'"fkToTableStr": "' + referenced_schema.name + '.' + referenced_table.name + '", ', '') + 

	'"description": ""}' AS [JSON]
INTO #columnJSON
FROM sys.columns AS c
LEFT JOIN sys.foreign_key_columns AS fkc ON fkc.parent_object_id = c.object_id 
		AND fkc.parent_column_id = c.column_id
LEFT JOIN sys.tables AS referenced_table ON referenced_table.object_id = fkc.referenced_object_id
LEFT JOIN sys.schemas AS referenced_schema ON referenced_table.schema_id = referenced_schema.schema_id
ORDER BY c.column_id;
-- -------------------------------------------------------------------------------------------------------




-- In later versions of SQL Server (2016 13.x) this can be done with FOR JSON
-- We are using STUFF to remove the initial commas
SELECT
'[' + 
STUFF((
	SELECT 
		s.JSONStart + 
		STUFF((
			SELECT
				t.JSONStart + 
				STUFF((
					-- If we return just the c.JSON without modification, it converts to XML
					-- so we're adding an empty string to it.
					SELECT '' + c.JSON FROM #columnJSON AS c
					WHERE c.table_id = t.id
					ORDER BY c.id
					FOR XML PATH('')
				), 1, 1, '') + 
				']}'
			FROM #tableJSON AS t
			WHERE t.schema_id = s.id
			ORDER BY t.id
			FOR XML PATH('')
		), 1, 1, '') + 
		']}'
	FROM #schemaJSON AS s
	ORDER BY s.id
	FOR XML PATH('')
), 1, 1, '') + 
']' AS Generated_JSON;




-- Cleanup
DROP TABLE #schemaJSON;
DROP TABLE #tableJSON;
DROP TABLE #columnJSON;