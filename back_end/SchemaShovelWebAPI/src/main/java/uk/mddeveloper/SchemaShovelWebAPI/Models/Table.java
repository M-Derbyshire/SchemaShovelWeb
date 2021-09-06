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
 * A model for entities in the "Table" table.
 * @author Matthew Derbyshire
 *
 */
@Entity
@javax.persistence.Table(name = "\"Table\"")
public class Table implements IDescribable, INameable {
	
	/**
	 * Constructor
	 */
	public Table() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//Can be null, in case of description updates
	private String name;
	
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "schemaID")
	@JsonIgnore
	private Schema schema;
	
	
	@OneToMany(mappedBy = "table")
	private List<Column> columns;
	
	
	
	/**
	 * Get a list of the "column" entities that are children of this entity
	 * @return A list of the "column" entities that are children of this entity
	 */
	public List<Column> getColumns() {
		return columns;
	}

	/**
	 * Set the list of the "column" entities that are children of this entity
	 * @param columns The new list of the "columns" entities that are children of this entity
	 */
	public void setColumns(List<Column> columns) {
		this.columns = columns;
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
	 * Get the "schema" entity that is the parent of this entity
	 * @return The "schema" entity that is the parent of this entity
	 */
	public Schema getSchema() {
		return schema;
	}

	/**
	 * Set the "schema" entity that is the parent of this entity
	 * @param schema The "schema" entity that is the parent of this entity
	 */
	public void setSchema(Schema schema) {
		this.schema = schema;
	}
	
	
	
}
