import { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { queryAPI } from "./api/getGameState";



let gameState = null;
async function getGameState(){
  console.log("getting gamestate");
  gameState = await queryAPI();
  console.log(gameState);
  getGameState();
}

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      gameState = await queryAPI();
      console.log(gameState);
      setData(gameState);
      getData();
    }
    getData();
  }, []);


    if(gameState == null || gameState.map == undefined){
      return(
        <div className="App">
         <div>
            <p>Awaiting Game</p>
         </div>
      </div>
      )
    }
    return(
      <div className="App">
         <div>
            <p>{data.map.name}</p>
         </div>
      </div>
    )
};

export default App;
