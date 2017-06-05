import { inject, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { FirebaseService } from './firebase.service';

describe('FirebaseService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FirebaseService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (instance: MockBackend, options: BaseRequestOptions) => new Http(instance, options),
                    deps: [ MockBackend, BaseRequestOptions ]
                }
            ],
            imports: [
                HttpModule
            ]
        });
    });

    it('should be defined', inject([FirebaseService], (firebase: FirebaseService) => {
        expect(firebase).toBeDefined();
    }));

    it('should contain getFeed method', inject([FirebaseService], (firebase: FirebaseService) => {
        expect(firebase.getFeed).toBeDefined();
    }));

    it('getFeed should return data from API', inject([ FirebaseService, MockBackend ],(firebase: FirebaseService, backend: MockBackend) => {

        const mockResponse = {
            "id": {
                "content": "test content",
                "title": "test title"
            }
        };

        backend.connections.subscribe((conn: MockConnection) => {
            conn.mockRespond(new Response(
                new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })
            ));
        });

        const result = firebase.getFeed();

        result.subscribe(response => {
            expect(response.json()).toEqual(mockResponse)
        })

    }));

});
