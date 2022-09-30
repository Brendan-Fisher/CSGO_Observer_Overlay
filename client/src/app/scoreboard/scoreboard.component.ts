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
  bombTime: any;
  defuseTime: any;
  prevCount = 400;
  plantedBombTime: any;

  
  ngOnInit(): void {
    this.socketService.socket.on('scoreboard', (data: any) => {
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

      this.bombTimer(this.bomb);
      this.defuseTimer(this.bomb);
    })
  }


  bombTimer(bomb: any) {
    if(bomb.state === 'defusing'){
      if(this.prevState.bomb.state === "planted"){
        this.plantedBombTime = new Date();
        this.prevCount = this.prevState.bomb.countdown * 10;
      }

      var diff = this.prevCount -  Math.round(Math.abs(new Date().getTime() - this.plantedBombTime.getTime()) / 100);

      this.bombTime = "bomb-" + diff;
    }
    else if(bomb.state === 'planted'){
      this.bombTime = "bomb-" + (bomb.countdown * 10);
    }
    

  }

  defuseTimer(bomb: any){
    if(bomb.state === 'defusing'){
      this.defuseTime = "defuse-" + (bomb.countdown * 10);
    }
  }
}
