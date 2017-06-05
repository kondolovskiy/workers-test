import { Injectable, EventEmitter } from '@angular/core';
import { BaseRequestOptions, RequestOptions, URLSearchParams } from '@angular/http';
import * as firebase from 'firebase';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

  public loginState: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    super();

    this.init();
  }

  private init() {
  	let config = {
            apiKey: "AIzaSyD43iVUWFV1LU_CIAMS5GuwywYblhR3XpY",
            authDomain: "test-project-5c622.firebaseapp.com",
            databaseURL: "https://test-project-5c622.firebaseio.com",
            projectId: "test-project-5c622",
            storageBucket: "test-project-5c622.appspot.com",
            messagingSenderId: "375778848821"
        };

        firebase.initializeApp(config);

        firebase.auth().signInAnonymously();

        firebase.auth().onAuthStateChanged(user => {
        	if(user.uid) {
	        	let params = new URLSearchParams();
			    params.set('auth', user.ie);
			    this.search = params;	

			    this.loginState.emit(user.ie);
        	}
        });
  }

}

export const requestOptionsProvider = { provide: RequestOptions, useClass: DefaultRequestOptions };