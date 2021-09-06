# SchemaShovelWeb

SchemaShovelWeb is a web-based application, designed to make it easier to analyse and document a database's structure, when you don't have any pre-existing documentation for it. The application has a ReactJS front-end, a Java/Spring-Boot back-end, and a MySQL database.

First, the user will use one of the schema-generation SQL scripts (see */schema_generation_scripts*) to generate a JSON representation of the schemas/tables/columns in the database (at the time of writing -- as a proof of concept -- this project only contains a SQL Server script). Next, the user will need to enter that JSON into the database-addition screen, along with a name for the database. Finally, once the JSON has been uploaded into the system, the user can start to analyse and document.

The application allows you to add descriptions to the schemas/tables/columns in the database record. You can also filter by the names/descriptions of these entities. You can also select a table, and have the application filter to just tables that have a foreign-key constraint to that table -- helping you to truly get to grips with how entities are connected in that particular database.

## Running the application

The application has a ReactJS front-end, and a Spring-Boot back-end. You should be able to run/test the back-end from an IDE such as Eclipse, and information on how to run/test the front-end can be found in */front_end/package.json*.

That being said, there a few pre-requisites you will need to set up before you can get the application running:

- In */back_end/database*, there is a file called *create_database.sql*. This script will need to be ran on your MySQL instance, to generate the database.
- In */front_end/public*, you will find a file called *settings.json*. This file will contain 3 properties: 
    - **apiBaseURL** - This is the root URL of the API. E.g. http://api.com/api/v1
    - **dbNameCharLimit** - The database-generation script will set the max-size of the name field for records in the [database] table. This should match that character limit.
    - **entityDescCharLimit** - The database-generation script will also set the maximum character size of the description fields in the [schema]/[table]/[column] tables. This should match that limit.
- In */back_end/SchemaShovelWebAPI/src/main/resources*, you will need to create a file called *application.properties*. You will see a file already in that directory named *application.properties.example*. That example file will contain example values for all of the settings the API will need in *application.properties*.

## Documentation

The documentation for the application can be found in the below locations:

- **Front-end** - The documentation for the ReactJS application can be found in */front_end/documentation*. Note that there are 2 sets of documentation: one for components, and another for general classes. This is due to the limitations of the individual document-generation systems used. You can find the npm commands for generating each type of documentation in the *package.json* file.
- **Back-end** - The documentation for the back-end can be found in */back_end/SchemaShovelWebAPI/doc*. This was generated with Javadoc, and can be generated from an IDE such as Eclipse.
- **Database** - The documentation for the database can be found in */back_end/database*. This was written manually with OpenOffice Writer (then converted to PDF). In this directory, there is also a file called *SchemaShovelWebModel.mwb*. This contains the model diagram for the database, and can be viewed in MySQL Workbench.

[My Twitter: @mattdarbs](http://twitter.com/mattdarbs)  
[My Portfolio](http://md-developer.uk)
