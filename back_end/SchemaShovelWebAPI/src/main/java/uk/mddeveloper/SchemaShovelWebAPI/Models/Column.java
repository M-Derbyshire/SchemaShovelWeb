package uk.mddeveloper.SchemaShovelWebAPI.Models;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@javax.persistence.Table(name = "\"Column\"")
public class Column implements IDescribable, INameable {
	
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
	
	
	//Provide a JSON fkToTableId property
	@ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "foreign_key_to_table_id", nullable = true)
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("fkToTableId")
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Table fkToTable;
	
	
	@Transient
	@JsonProperty(access = Access.WRITE_ONLY)
	private String fkToTableStr;
	
	
	
	
	
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

	@JsonIgnore
	public String getFkToTableStr() {
		return fkToTableStr;
	}

	public void setFkToTableStr(String fkToTableStr) {
		this.fkToTableStr = fkToTableStr;
	}
	
	public Table getFkToTable() {
		return fkToTable;
	}

	public void setFkToTable(Table fkToTable) {
		this.fkToTable = fkToTable;
	}
}
