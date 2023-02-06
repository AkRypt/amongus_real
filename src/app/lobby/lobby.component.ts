import { Component, Host, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby } from '../lobby';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import firebase from 'firebase/compat/app'
import { doc, setDoc, deleteDoc, getFirestore } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LobbyComponent implements OnInit {

  user = this.authService.getUser();
  // lobbies!: Observable<any[]>;
  lobby;
  lobbyRefTemp;
  code;
  members = Array();
  users;
  taskList;
  tasks;
  currMember;
  editClicked!: boolean;
  editedTask;
  currentTid;
  isNewTask!: boolean;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private router: Router,
  ) {

    this.code = localStorage.getItem('code')
    this.lobby = db.collection('lobbies').doc(this.code)
    this.getItems()

  }

  ngOnInit(): void {}

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
      // this.updateUser()
    })

    this.currMember = { 
      uid: localStorage.getItem('uid'),
      name: localStorage.getItem('name')
    }
    this.members.push(this.currMember)

    setTimeout(() => {
      this.updateUser()
    }, 2000);
  }

  updateUser() {
    Object.entries(this.users).forEach(([key, value], index) => {
      if (key == this.currMember.uid) return
    });
    this.users[this.currMember.uid] = this.currMember
    this.lobby.update({
      users: this.users
    })
  }

  /// Tasks Control Methods
  onClickEdit(task) {
    this.editClicked = !this.editClicked;
    this.currentTid = task.tid
    this.isNewTask = false;
  }
  onKey(event) {this.editedTask = event.target.value;}
  
  onClickNewTask() {
    this.editClicked = !this.editClicked;
    this.isNewTask = true;
  }

  onEditSubmit(e) {
    e.preventDefault()
    this.editClicked = !this.editClicked;
    if (this.isNewTask) {
      let tempTid = (Math.random() + 1).toString(36).substring(6);
      this.taskList[tempTid] = {tid: tempTid, task: this.editedTask}
    } else {
      this.taskList[this.currentTid]["task"] = this.editedTask;
    }
    this.lobby.update({
      tasks: this.taskList
    })
  }

  onClickDelete(task) {
    delete this.taskList[task.tid]
    this.lobby.update({
      tasks: this.taskList
    })
  }
  /// -------------------

  // To remove current user from the lobby
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    delete this.users[this.currMember.uid]
    console.log(this.users)
    this.lobby.update({
      users: this.users
    })

    // Deleting lobby if lobby is empty
    if (Object.keys(this.users).length == 0) {
      deleteDoc(doc(getFirestore(), "lobbies", this.code))
    }
  }

  // Starting the game
  onStart() {
    this.router.navigate(['/game', this.code], {state: {data: this.code}});
  }

}


// this.lobby.update({
//   users: firebase.firestore.FieldValue.arrayUnion(this.currMember)
// })