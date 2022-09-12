import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby } from '../lobby';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LobbyComponent implements OnInit {

  lobbies!: Observable<any[]>;
  code = history.state.data;
  members = [
    {
      uid: 1,
      name: "Akshit",
    },
    {
      uid: 2,
      name: "Aks",
    },
    {
      uid: 3,
      name: "Zexh",
    },
  ]
  tasks = [
    {
      uid: 1,
      task: "Do pushups"
    }
  ]

  constructor(private db: AngularFirestore) {
    this.lobbies = db.collection('lobbies').valueChanges();
    this.lobbies.subscribe(item => {
      this.tasks = []
      for (let i = 0; i < item[0]['tasks'].length; i++) {
        this.tasks.push(item[0]['tasks'][i])
      }
    })
  }

  ngOnInit(): void {
  }

}
