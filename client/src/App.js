import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import { queryAPI } from "./api/getGameState";


async function getGameState(){
  console.log("getting gamestate");
  let gameState = await queryAPI();
}

class App extends Component {
  componentDidMount(){
    getGameState();
  }

  render() {
    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Beans
          </a>
        </header>
      </div>
    )
  };
}

export default App;
