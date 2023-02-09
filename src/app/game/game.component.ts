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
  isImposter!: boolean; // Change later to boolean
  impRevealed!: boolean; // Change later to boolean
  crewmatesDead!: boolean;
  tasksFinished!: boolean;

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
      console.log("item", item)
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
    console.log(this.tasks)
    this.tasks[task.tid]["isDone"] = true
    console.log(this.tasks)
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
    // this.crewmatesDead = true
    // this.endGame()
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
    // this.tasksFinished = true
    // this.endGame()
  }

  endGame() {
    if (this.tasksFinished) {
      alert("Crewmates Won")
    } else if (this.crewmatesDead) {
      alert("Imposter won")
    }
  }
}
