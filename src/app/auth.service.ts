import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
        console.log(result.user?.uid)
        let users = this.db.collection('users');
        users.add({
          uid: result.user?.uid, 
          name: result.user?.displayName,
        });
        // this.router.navigate(['/lobby'], {state: {data: this.code}});
        this.router.navigate(['/main'])
      })
      .catch(err => {
        console.log(err)
      });
  }
}
