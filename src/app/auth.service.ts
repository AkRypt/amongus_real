import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDetails = {};

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
  ) { }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  AuthLogin(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        // Code to update database
        let users = this.db.collection('users');
        this.userDetails = {
          uid: result.user?.uid, 
          name: result.user?.displayName,
        }
        users.add(this.userDetails);
        localStorage.setItem('name', String(result.user?.displayName))
        localStorage.setItem('uid', String(result.user?.uid))
        this.router.navigate(['/main'])
      })
      .catch(err => {
        console.log(err)
      });
  }

  getUser() {
    return this.userDetails;
  }
}
