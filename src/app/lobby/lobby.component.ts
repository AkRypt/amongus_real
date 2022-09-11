import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  code = (Math.random() + 1).toString(36).substring(6);
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
      name: "Do pushups",
    },
    {
      uid: 2,
      name: "Do situps",
    },
    {
      uid: 3,
      name: "Do friction",
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
