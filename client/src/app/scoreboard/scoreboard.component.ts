import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../socket-io.service';
import { matchConfig } from '../../assets/match-info/matchConfig';

@Component({
  selector: 'scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  constructor(private socketService: SocketIoService){  }
  
  
  teamOneName: any;
  teamTwoName: any;
  teamOneSide: any;
  teamTwoSide: any;
  teamOneScore: any;
  teamTwoScore: any;
  phases: any;
  bomb: any;
  prevState: any;
  mapInfo: any;
  bombTime = "bomb-0";
  defuseTime = "defuse-";
  prevCount = 400;
  plantedBombTime: any;

  
  ngOnInit(): void {
    this.socketService.socket.on('scoreboard', (data: any) => {
      console.log(data);
      this.phases = data.phases;
      this.bomb = data.bomb;
      this.mapInfo = data.mapInfo;
      this.prevState = data.prevState;

      this.mapInfo.round++;

      this.teamOneSide = (this.mapInfo.round > 15) ? matchConfig.teamTwoStartSide : matchConfig.teamOneStartSide;
      this.teamTwoSide = (this.mapInfo.round > 15) ? matchConfig.teamOneStartSide : matchConfig.teamTwoStartSide;
      this.teamOneName = matchConfig.teamOneName;
      this.teamTwoName = matchConfig.teamTwoName;

      this.teamOneScore = (this.teamOneSide === 'CT') ? this.mapInfo.team_ct.score : this.mapInfo.team_t.score;
      this.teamTwoScore = (this.teamTwoSide === 'CT') ? this.mapInfo.team_ct.score : this.mapInfo.team_t.score;

      this.timers(data.bomb);
    })
  }


  timers(bomb: any) {
    console.log("Setting timers");
    console.log(bomb.state);
    if(bomb.state === "defusing"){

      this.defuseTime = "defuse-" + (bomb.countdown * 20);

      if(this.prevState.bomb.state === "planted"){
        console.log("Bomb is being defused");
        this.plantedBombTime = new Date();
        this.prevCount = this.prevState.bomb.countdown * 10;
      }

      var diff = this.prevCount -  Math.round(Math.abs(new Date().getTime() - this.plantedBombTime.getTime()) / 100);
      console.log(diff);
      this.bombTime = "bomb-" + diff;

      
      
    }
    else if(bomb.state === 'planted'){
      this.bombTime = "bomb-" + (bomb.countdown * 10);
    }
  }
}
