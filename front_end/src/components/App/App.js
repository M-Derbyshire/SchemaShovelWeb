import React, { Component } from 'react';
import './App.css';
import SelectableList from '../SelectableList/SelectableList';


class App extends Component
{
	render()
	{
		return (
			<div className="App">
				<header>
					<h1>Schema Shovel Web</h1>
					<h2>Select a database schema below (or upload a new schema) to begin</h2>
				</header>
				
				<SelectableList>
					<p>Test1</p>
					<p>Test2</p>
					<p>Test3</p>
				</SelectableList>
			</div>
		);
	}
}

export default App;