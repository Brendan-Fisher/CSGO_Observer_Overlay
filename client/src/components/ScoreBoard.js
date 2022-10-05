import "./../styles/ScoreBoard.scss";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import {FlashingBomb, Bomb, Defuse } from "../assets/Icons";
import { teamOneLogo, teamTwoLogo, teamOneName, teamTwoName, } from "../teamInfo.js"

const socket = io("http://localhost:5001");


var PlantedBombTime;
var prevCount = 400;
let swap = 0;
let startingSide = 'ct'; //starting side for team one
window.addEventListener("keydown", (event) => {
  if(event.key === "`") {
    if(swap === 0) {
      swap = 1
    } else {
      swap = 0
    }
  }
  if(event.key === "0") {
    if(startingSide === 'ct') {
      startingSide = 't'
    } else {
      startingSide = 'ct'
    }
  }
});

function printTeamName(side){
  //team one is always at left
  //team one should start ct, if they don't, press 0
  if(side === "R") {
      if(startingSide === 't') {
        return teamOneName;
      }
      return teamTwoName
  } else {
      if(startingSide === 't') {
        return teamTwoName;
      }
      return teamOneName
  }
}

function printTeamLogo(side) {
  if (side) {
    if(swap === 0){
      return teamOneLogo;
    } else {
      return teamTwoLogo;
    }
  } else {
    if(swap === 0) {
      return teamTwoLogo;
    } else {
      return teamOneLogo;
    }
  }
}

function printTime(scoreBoard) {
    if (scoreBoard.phaseInfo.phase === "bomb") {
        return <FlashingBomb className="bombImage" />
    }
    if (scoreBoard.phaseInfo.phase === "defuse"){
        return <Defuse className="bombImage" />
    }
    if (scoreBoard.phaseInfo.phase_ends_in < 10 && scoreBoard.phaseInfo.phase === "live") {
        return <div id="timelow">{scoreBoard.phaseInfo.phase_ends_in}</div>;
    }

    return <div id="time">{scoreBoard.phase_ends_in}</div>;
}

function BombTimer(scoreBoard) {
    if (!scoreBoard.bomb) return <div></div>;
    if(scoreBoard.bomb.state == "carried") {
      return <div></div>
    }

    if (scoreBoard.bomb.state === "planted") {
      if (scoreBoard.bomb.countdown > 10) {
        return <div className="BombTimer">
          <div className="BombRevchart">
            <div className={'bombReverse-' + (scoreBoard.bomb.countdown * 10)}/>
          </div>
          <div className="Rchart">
            <div className={'bomb-' + (scoreBoard.bomb.countdown * 10)}/>
          </div>
        </div>

      } else {
        return <div className="BombTimer">
          <div className="BombRevchart">
            <div className={'tensecondsReverse-' + (scoreBoard.bomb.countdown * 10)}/>
          </div>
          <div className="Rchart">
            <div className={'tenseconds-' + (scoreBoard.bomb.countdown * 10)}/>
          </div>
        </div>
      }
    }

    if(scoreBoard.bomb.state === "defusing"){
        if(scoreBoard.previously.bomb.state === "planted") {
            PlantedBombTime = new Date();
            prevCount = scoreBoard.previously.bomb.countdown * 10;
        }
        var diff = prevCount - Math.round(Math.abs(new Date() - PlantedBombTime) / 100);

        return  <div className="BombTimer">
                    <div className="Lchart">
                        <div className={'defuse-' + (scoreBoard.bomb.countdown * 10)}/>
                    </div>
                    <div className="Rchart">
                        <div className={'bomb-' + diff}/>
                    </div>
                </div>
    }
}

function printCTWinName() {
  if(swap) {
    return teamTwoName;
  } else {
    return teamOneName;
  }
}

function printTWinName() {
  if(swap) {
    return teamOneName;
  } else {
    return teamTwoName;
  }
}

function printCTWinLogo(){
  if(swap) {
    return teamTwoLogo;
  } else {
    return teamOneLogo;
  }
}

function printTWinLogo(){
  if(swap) {
    return teamOneLogo;
  } else {
    return teamTwoLogo;
  }
}

function roundWin(scoreBoard) {
  if(scoreBoard.phaseInfo.phase !== "over") {
    return <div/>; //Return if phase isn't over
    //Causes undefined behavior otherwise
  }
  //console.log(scoreBoard.roundWins[scoreBoard.round])
  var roundWinType = scoreBoard.roundWins[scoreBoard.round]
  var s = ""
  //Gets the GSI string relating to who won the current round, given that the round phase is 'over'
  if(roundWinType === "ct_win_elimination" ||roundWinType ===  "ct_win_defuse" || roundWinType === "ct_win_time") {
    //CT WIN ROUND
    return <div className = "roundEnd">
      <div className={"teamLogoEnd"}> <img src={printCTWinLogo()}/></div>
      <div className={"CTWin"}>
        <div className="roundEndText">{printCTWinName()}</div> <div className={"CTWin"}><div className="roundEndText">WIN THE ROUND </div>
      </div>
      </div>
    </div>
  } else {
    //T WIN ROUND
    return <div className = "roundEnd">
      <div className={"teamLogoEnd"}> <img src={printTWinLogo()}/></div>
      <div className={"TWin"}>
        <div className="roundEndText">{printTWinName()}</div> <div className={"TWin"}><div className="roundEndText">WIN THE ROUND </div>
      </div>
      </div>
    </div>
  }
}

export function ScoreBoard() {
    const [scoreBoard, setSB] = useState(null);

    useEffect(() => {
        socket.on("scoreboard", (scoreboard) => {
            setSB(scoreboard);
        });
    });
    //console.log(scoreBoard)
    if (scoreBoard) {
        return (
            <div className="scoreboard">
                <div
                    className="TeamName"
                    {...(scoreBoard.phaseInfo.phase !== "freezetime"
                        ? { id:"hidden" }
                        : {})}
                >
                    <p className="teamLeftName">
                      {printTeamName("L")}
                    </p>
                </div>
                <div className="teamImage">
                    <img src={printTeamLogo(scoreBoard.leftCT)}></img>
                </div>
                <div className="TeamLeft">
                    <p className={scoreBoard.leftCT ? "ct-score" : "tscore"}>
                        {scoreBoard.leftCT ? scoreBoard.CTScore : scoreBoard.TScore}
                    </p>
                </div>
                <div className="Match_info">
                    {printTime(scoreBoard)}
                    <div id="round">ROUND {scoreBoard.round + 1}/30</div>
                </div>
                <div className="TeamRight">
                    <p className={scoreBoard.leftCT ? "tscore" : "ct-score"}>
                        {scoreBoard.leftCT ? scoreBoard.TScore : scoreBoard.CTScore}
                    </p>
                </div>
                <div className="teamImage">
                    <img src={printTeamLogo(!scoreBoard.leftCT)}></img>
                </div>
                <div
                    className="TeamName"
                    {...(scoreBoard.phaseInfo.phase !== "freezetime"
                        ? { id:"hidden" }
                        : {})}>
                    <p className="teamRightName">
                        {printTeamName("R")}
                    </p>
                </div>

                {BombTimer(scoreBoard)}
              {roundWin(scoreBoard)}
            </div>

        );
    } else {
        return <div></div>;
    }
}

export default ScoreBoard;
