import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Lobby } from '../lobby';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import firebase from 'firebase/compat/app'
import { doc, setDoc } from 'firebase/firestore';

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
  tasks;
  currMember;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
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
      this.tasks = []
      console.log("1", item)
      Object.entries(item['users']).forEach(([key, value], index) => {
        this.users[key] = value
      });
      // for (let i = 0; i < item['users'].length; i++) {
      //   this.members.push(item['users'][i])
      // }
      for (let i = 0; i < item['tasks'].length; i++) {
        this.tasks.push(item['tasks'][i])
      }
      this.updateUser()
    })
  }

  async updateUser() {
    try {
      this.currMember = { 
        uid: localStorage.getItem('uid'),
        name: localStorage.getItem('name')
      }

      Object.entries(this.users).forEach(([key, value], index) => {
        if (key == this.currMember.uid) return
        this.members.push(value)
      });
      this.members.push(this.currMember)
      // for (let member of this.members) {
      //   if (member.uid == this.currMember.uid) {
      //     return
      //   }
      // }

      this.users[this.currMember.uid] = this.currMember
      console.log(this.users)
      // await setDoc(doc(this.db, "lobbies", this.code "users", this.currMember.uid), this.currMember)
      // this.db.collection('lobbies').doc(this.code+"/users/"+this.currMember.uid).set(this.currMember)
      this.lobby.update({
        users: this.users
      })
      // this.lobby.update({
      //   users: firebase.firestore.FieldValue.arrayUnion(this.currMember)
      // })
    } catch (e) {
      console.log("In updateUser, e: ", e)
    }
  }

  @HostListener('window:beforeunload')
  onPageClose() {
    this.lobby.update({
      // users: firebase.firestore.FieldValue.arrayRemove(this.currMember.uid)
    })
  }

}
