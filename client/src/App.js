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
         <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
          >
            Beans
          </a>
      </div>
    )
  };
}

export default App;
