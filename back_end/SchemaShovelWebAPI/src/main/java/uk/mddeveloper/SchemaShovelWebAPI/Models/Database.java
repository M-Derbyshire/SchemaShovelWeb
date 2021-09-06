package uk.mddeveloper.SchemaShovelWebAPI.Models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * A model for entities in the "Database" table.
 * 
 * @author Matthew Derbyshire
 *
 */
@Entity
@javax.persistence.Table(name = "\"database\"")
public class Database implements INameable {
	
	/**
	 * Constructor
	 */
	public Database() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty(message = "Name must be provided") //This covers null as well
	private String name;
	
	//Has to be able to be null, as update requests will not provide this
	@OneToMany(mappedBy = "database")
	private List<Schema> schemas;
	
	
	/**
	 * Get a list of the "schema" entities that are children of this entity
	 * @return A list of the "schema" entities that are children of this entity
	 */
	public List<Schema> getSchemas() {
		return schemas;
	}

	/**
	 * Set the list of the "schema" entities that are children of this entity
	 * @param schemas The new list of the "schema" entities that are children of this entity
	 */
	public void setSchemas(List<Schema> schemas) {
		this.schemas = schemas;
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
	 * Get the name of the entity
	 * @return The name of the entity
	 */
	public String getName() {
		return name;
	}

	/**
	 * Set the name of the entity (this has a not-empty validation constraint)
	 * @param name The new name for the entity
	 */
	public void setName(String name) {
		this.name = name;
	}
	
}
