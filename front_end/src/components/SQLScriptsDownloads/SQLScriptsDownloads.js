import { Component } from 'react';
import "./SQLScriptsDownloads.css";
import { Link } from 'react-router-dom';

/**
* Used to display a database entity record (entities from an instance of FilterableSchemaList)
*
*@component
 */
class SQLScriptsDownloads extends Component {
    
    /** Render the SQLScriptsDownloads */
    render()
    {
        return (
            <div className='SQLScriptsDownloads'>
                <h3>Schema Generation Scripts:</h3>
                
                <ul>
                    <li><Link to="/downloads/sql/SQLServer_JSON_schema_generation.sql" target="_blank" download>SQL Server</Link></li>
                </ul>
            </div>
        );
    }
    
}


export default SQLScriptsDownloads;