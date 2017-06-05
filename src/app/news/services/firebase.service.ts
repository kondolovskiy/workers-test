import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';


@Injectable()
export class FirebaseService {

    private host = 'https://test-project-5c622.firebaseio.com/';

    constructor(private http: Http) {
        
    }

    public addNews(title: string, content: string) {
        let headers = new Headers({
            'Content-type': 'application/json'
        });

        return this.http.post(this.host + 'news.json', {title, content}, headers)
            .map((response) => response.json());
    }
    
    public getFeed() {
        return this.http.get(this.host + 'news.json')
            .map((response) => response.json());
    }
}