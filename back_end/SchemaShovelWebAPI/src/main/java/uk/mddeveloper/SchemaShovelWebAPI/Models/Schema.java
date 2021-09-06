package uk.mddeveloper.SchemaShovelWebAPI.Models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A model for entities in the "Schema" table.
 * @author Matthew Derbyshire
 *
 */
@Entity
@javax.persistence.Table(name = "\"Schema\"")
public class Schema implements IDescribable, INameable {
	
	/**
	 * Constructor
	 */
	public Schema() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "databaseID")
	@JsonIgnore
	private Database database;
	
	//Can be null, in case of description updates
	private String name;
	
	private String description;
	
	
	@OneToMany(mappedBy = "schema")
	private List<Table> tables;
	
	
	/**
	 * Get a list of the "table" entities that are children of this entity
	 * @return A list of the "table" entities that are children of this entity
	 */
	public List<Table> getTables() {
		return tables;
	}

	/**
	 * Set the list of the "table" entities that are children of this entity
	 * @param tables The new list of the "table" entities that are children of this entity
	 */
	public void setTables(List<Table> tables) {
		this.tables = tables;
	}

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
	 * Get the "database" entity that is the parent of this entity
	 * @return The "database" entity that is the parent of this entity
	 */
	public Database getDatabase() {
		return database;
	}

	/**
	 * Set the "database" entity that is the parent of this entity
	 * @param database The "database" entity that is the parent of this entity
	 */
	public void setDatabase(Database database) {
		this.database = database;
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
	
	
}
