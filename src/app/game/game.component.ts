import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';


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
  isImposter!: boolean; // Change later to boolean
  impRevealed!: boolean; // Change later to boolean
  crewmatesDead!: boolean;
  tasksFinished!: boolean;
  gameDone!: boolean;
  emergencyReady!: boolean;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private location: Location,
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
      this.crewmatesDead = item['crewmatesDead'];
      this.tasksFinished = item['tasksFinished'];
      Object.entries(item['users']).forEach(([key, value], index) => {
        this.users[key] = value
        this.members.push(value)
      });
      Object.entries(item['tasks']).forEach(([key, value], index) => {
        this.taskList[key] = value
        this.tasks.push(value)
      });

      // Checking if someone won
      this.endGame()
    })

    this.currMember = { 
      uid: localStorage.getItem('uid'),
      name: localStorage.getItem('name'),
      isAdmin: localStorage.getItem('isAdmin'),
      isImposter: false
    }
    this.members.push(this.currMember)

    // Selecting imposters
    setTimeout(() => {
      if (this.users[this.currMember.uid]["isImposter"]) {
        this.isImposter = true
      }
      this.impRevealed = true
    }, 3000);
  }

  onCheckTask(task) {
    for (let i of this.tasks) {
      if (i["tid"] == task.tid) {
        i["isDone"] = true
      }
    }
    for (let task in this.tasks) {
      if (this.tasks[task]["isDone"] == false) return;
    }
    this.users[this.currMember.uid]["tasksDone"] = true
    this.lobby.update({
      users: this.users,
    })
    this.checkTasks()
  }

  onKillMember(member) {
    member["isDead"] = true
    this.users[member.uid]["isDead"] = true
    this.lobby.update({
      users: this.users,
    })
    this.checkDead()
  }

  onEmergency() {
    
  }

  checkDead() {
    if (Object.keys(this.users).length == 0) return;
    for (let user in this.users) {
      if (this.users[user]["isDead"] == false) {
        return;
      }
    }
    this.lobby.update({
      crewmatesDead: true,
      inGame: false,
    })
  }

  checkTasks() {
    if (Object.keys(this.users).length == 0) return;
    for (let user in this.users) {
      if (this.users[user]["tasksDone"] == false) {
        return;
      }
    }
    this.lobby.update({
      tasksFinished: true,
      inGame: false,
    })
  }

  endGame() {
    if (this.gameDone) return;
    if (this.tasksFinished) {
      alert("Crewmates Won")
    } else if (this.crewmatesDead) {
      alert("Imposters won")
    } else { return }
    this.gameDone = true;
    this.router.navigate(
      ['/lobby', this.code], 
      {state: {data: this.code}}
    );
  }
}
