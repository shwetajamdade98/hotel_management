import { Component, OnInit ,Inject} from '@angular/core';
import { LeaderService} from '../services/leader.service';
import { flyInOut, expand }from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]':'true',
    'style': 'display:block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})

export class AboutComponent implements OnInit
 {
  public leaders = [];
  errMess:string;

  constructor( private leaderService:LeaderService,
    @Inject('BaseURL')private BaseURL){ }


    ngOnInit() {
       this.leaderService.getLeaders()
      .subscribe((leaders) => this.leaders = leaders,
      errMess => this.errMess = <any>errMess);

    }



}
