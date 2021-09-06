package uk.mddeveloper.SchemaShovelWebAPI.Models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * A model for entities in the "Column" table. When converting into JSON, the fkToTable field 
 * will only be the ID of the related "table" record
 * 
 * @author Matthew Derbyshire
 *
 */
@Entity
@javax.persistence.Table(name = "\"Column\"")
public class Column implements IDescribable, INameable {
	
	/**
	 * Constructor
	 */
	public Column() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//Can be null, in case of description updates
	private String name;
	
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "tableID")
	@JsonIgnore
	private Table table;
	
	
	//Provide a JSON fkToTableId property
	@ManyToOne(optional = true)
    @JoinColumn(name = "foreign_key_to_table_id", nullable = true)
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("fkToTableId")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Table fkToTable;
	
	
	@Transient
	@JsonProperty(access = Access.WRITE_ONLY)
	private String fkToTableStr;
	
	
	
	
	/**
	 * Get the PK of the entity
	 * @return The PK of the entity
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Set the PK of the entity
	 * @param id The new PK of the entity
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * Get the name of the entity
	 * @return The name of the entity
	 */
	public String getName() {
		return name;
	}

	/**
	 * Set the name of the entity
	 * @param name The new name for the entity
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * Get the description of the entity
	 * @return The description of the entity
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * Set the description of the entity
	 * @param description The new description for the entity
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * Get the Table instance that this entity is a child of
	 * @return The Table instance that this entity is a child of
	 */
	public Table getTable() {
		return table;
	}

	/**
	 * Set the new Table instance that this entity is a child of
	 * @param table The new table that this entity is a child of
	 */
	public void setTable(Table table) {
		this.table = table;
	}

	/**
	 * Get the string representation of the table that this "column" was an FK to in the 
	 * recorded database (e.g. "mySchema.theReferencedTable")
	 * @return The string representation of the table that this "column" was an FK to
	 */
	@JsonIgnore
	public String getFkToTableStr() {
		return fkToTableStr;
	}

	/**
	 * Set the string representation of the table that this "column" was an FK to in the 
	 * recorded database (e.g. "mySchema.theReferencedTable")
	 * @param fkToTableStr The string representation of the table that this "column" was an FK to
	 */
	public void setFkToTableStr(String fkToTableStr) {
		this.fkToTableStr = fkToTableStr;
	}
	
	/**
	 * Get the Table entity that this "column" was an FK to in the 
	 * recorded database
	 * @return The Table entity that this "column" was an FK to
	 */
	public Table getFkToTable() {
		return fkToTable;
	}

	/**
	 * Set the Table entity that this "column" was an FK to in the 
	 * recorded database
	 * @param fkToTable The Table entity that this "column" was an FK to
	 */
	public void setFkToTable(Table fkToTable) {
		this.fkToTable = fkToTable;
	}
}
