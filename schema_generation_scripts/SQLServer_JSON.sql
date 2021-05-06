/*
	MAKE SURE YOU ARE RUNNING THIS AGAINST THE CORRECT DATABASE
*/

DECLARE @schemaResult VARCHAR(MAX), @tableResult VARCHAR(MAX), @columnsResult VARCHAR(MAX);
DECLARE @tableID INT;

SET @schemaResult = '';
SET @tableResult = '';
SET @columnsResult = '';


PRINT '[{';



-- First, we're going to generate an array of schemas, with their IDs.
-- The tables will then have links to these IDs. This is a weird form for 
-- JSON (usually the tables would be nested inside the schemas), however 
-- this script is made both more readable, and more performant, by us not
-- having to use a nested-cursor to make this work.
SET @schemaResult = @schemaResult + '"schemas": [';

SELECT 
	@schemaResult = @schemaResult + '{"id": ' + CAST(s.schema_id AS VARCHAR) + ', "name": "' + s.name + '", "description": ""},'
FROM sys.schemas AS s
ORDER BY s.name;

-- We need to remove the comma from the end of the last object in this array.
SET @schemaResult = LEFT(@schemaResult, LEN(@schemaResult) - 1) + '],';
PRINT @schemaResult;





-- Get the table rows in a cursor.
-- Also, get the object_id of the table as well, to be referenced when searching for its columns.
DECLARE table_JSON_schema_cursor CURSOR LOCAL FOR
SELECT
	t.object_id,
	'{"table": "' + t.name + '", "schema": ' + CAST(o.schema_id AS VARCHAR) + ', "description": "", "columns": ['
FROM sys.tables AS t
JOIN sys.objects AS o ON t.object_id = o.object_id
ORDER BY t.name;



-- Now we can generate each column's output, and then print the entire data for each table.
PRINT '"tables": [';

OPEN table_JSON_schema_cursor;
FETCH NEXT FROM table_JSON_schema_cursor INTO @tableID, @tableResult;
WHILE @@FETCH_STATUS = 0
BEGIN
	
	SET @columnsResult = '';

	SELECT
		@columnsResult = @columnsResult + '{"column": "' + c.name + '", ' + 
		
		-- Now add FK_to values for schema and table (if this is an FK).
		IIF(referenced_table.name IS NOT NULL, 
			'"FK_to_schema": ' + CAST(referenced_table.schema_id AS VARCHAR) + ', "FK_to_table": ' + 
				CAST(referenced_table.object_id AS VARCHAR) + ', ', '') + 
		
		'"description": ""},'
	FROM sys.columns AS c
	LEFT JOIN sys.foreign_key_columns AS fkc ON fkc.parent_object_id = c.object_id AND fkc.parent_column_id = c.column_id
	LEFT JOIN sys.tables AS referenced_table ON referenced_table.object_id = fkc.referenced_object_id
	LEFT JOIN sys.schemas AS referenced_schema ON referenced_table.schema_id = referenced_schema.schema_id
	WHERE c.object_id = @tableID;

	-- Now output the full results for the table and its columns (removing trailing comma from the last 
	-- column in the columns array, and adding the comma to all but the last table in the table array).
	PRINT @tableResult + LEFT(@columnsResult, LEN(@columnsResult) - 1) + ']}';
	FETCH NEXT FROM table_JSON_schema_cursor INTO @tableID, @tableResult;
	IF @@FETCH_STATUS != -1 PRINT ',';
	
END;

CLOSE table_JSON_schema_cursor;

DEALLOCATE table_JSON_schema_cursor;


PRINT ']}]';