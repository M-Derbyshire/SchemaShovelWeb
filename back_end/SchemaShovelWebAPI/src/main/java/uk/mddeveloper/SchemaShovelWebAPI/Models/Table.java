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

@Entity
public class Table {
	
	public Table() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "schemaID")
	@JsonIgnore
	private Schema schema;
	
	
	@OneToMany(mappedBy = "table")
	private List<Column> columns;
	
	@OneToMany(mappedBy = "fkToTable")
	private List<Column> fkColumnsToThisTable;
	
	
	
	
	public List<Column> getColumns() {
		return columns;
	}

	public void setColumns(List<Column> columns) {
		this.columns = columns;
	}

	public List<Column> getFkColumnsToThisTable() {
		return fkColumnsToThisTable;
	}

	public void setFkColumnsToThisTable(List<Column> fkColumnsToThisTable) {
		this.fkColumnsToThisTable = fkColumnsToThisTable;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Schema getSchema() {
		return schema;
	}

	public void setSchema(Schema schema) {
		this.schema = schema;
	}
	
	
	
}
