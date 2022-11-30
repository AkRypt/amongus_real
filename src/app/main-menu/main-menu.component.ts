import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { tasks } from '../lobby';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  code = "";
  joinClicked!: boolean;

  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) {

    let name = localStorage.getItem('name')
    localStorage.setItem('code', '')
  }

  ngOnInit(): void {
  }

  onCreate() {
    this.code = (Math.random() + 1).toString(36).substring(6);
    let lobbies = this.db.collection('lobbies');
    lobbies.doc(this.code).set({
      code: this.code, 
      tasks: tasks,
      users: [],
    });
    localStorage.setItem('code', this.code)
    this.router.navigate(['/lobby', this.code], {state: {data: this.code}});
  }

  onJoinBtn() {
    this.joinClicked = !this.joinClicked;
  }

  onKey(event) {this.code = event.target.value;}

  onJoin() {
    localStorage.setItem('code', this.code)
    this.router.navigate(['/lobby', this.code], {state: {data: this.code}});
  }
  
}
