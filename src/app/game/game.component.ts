import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  user = this.authService.getUser();
  lobby;
  code;
  members = Array();
  users;
  taskList;
  tasks;
  currMember;
  editClicked!: boolean;
  editedTask;
  currentTid;
  isImposter!: boolean;
  impRevealed!: boolean;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private router: Router,
  ) {
    this.code = localStorage.getItem('code')
    this.lobby = db.collection('lobbies').doc(this.code)
    this.getItems()
  }

  ngOnInit(): void {
  }

  async getItems() {
    await this.lobby.valueChanges().subscribe(item => {
      this.users = {}
      this.members = []
      this.taskList = {}
      this.tasks = []
      Object.entries(item['users']).forEach(([key, value], index) => {
        this.users[key] = value
        this.members.push(value)
      });
      Object.entries(item['tasks']).forEach(([key, value], index) => {
        this.taskList[key] = value
        this.tasks.push(value)
      });
    })

    this.currMember = { 
      uid: localStorage.getItem('uid'),
      name: localStorage.getItem('name')
    }
    this.members.push(this.currMember)

    // Selecting imposters
    setTimeout(() => {
      
    }, 2000);
  }
}
