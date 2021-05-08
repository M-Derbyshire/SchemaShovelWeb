package uk.mddeveloper.SchemaShovelWebAPI.Models;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@javax.persistence.Table(name = "\"Column\"")
public class Column {
	
	public Column() {}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "tableID")
	@JsonIgnore
	private Table table;
	
	@javax.persistence.Column(name = "foreignKeyToSchemaTableName", nullable = true)
	private String fkToTable;
	
	
	
	
	
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

	public Table getTable() {
		return table;
	}

	public void setTable(Table table) {
		this.table = table;
	}

	public String getFkToTable() {
		return fkToTable;
	}

	public void setFkToTable(String fkToTable) {
		this.fkToTable = fkToTable;
	}
	
	
}
