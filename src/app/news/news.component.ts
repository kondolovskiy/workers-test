import { Component, OnInit, NgZone } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import * as firebase from 'firebase';


@Component({
	selector: 'news-list',
	templateUrl: './news.component.html',
	styleUrls: ['news.component.scss'],
	providers: [
		FirebaseService
	]
})
export class NewsComponent implements OnInit {

	public news: any;

	constructor(private zone: NgZone, private firebase: FirebaseService) {}

	public ngOnInit() {
		firebase.auth().onAuthStateChanged(user => {
        	this.getNews();
        });
	}

	public getNews() {
		this.firebase.getFeed().subscribe(response => {
			let result = [];
			for(let i in response) {
				result.push(response[i]);
			}

			this.zone.run(() => this.news = result);
		});
	}

}