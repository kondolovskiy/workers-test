import { HewsComponent } from './news.component';
import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './services/firebase.service';
import { NgZone } from '@angular/core';
import { requestOptionsProvider } from './services/default-request-options.service.ts';

describe('NewsComponent', () => {

    let component: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            	NewsComponent
            ],
            providers: [ 
                FirebaseService,
                NgZone,
                requestOptionsProvider
            ],
            imports: [ ]
        })

        fixture = TestBed.createComponent(NewsComponent);
        component = fixture.componentInstance;
    });

    it('component should be defined', () => {
		expect(component).toBeDefined();
    });

    it('component should get feed', () => {
        spyOn(component.firebase, 'getFeed');

        component.getFeed({});

        expect(component.listService.saveItem).toHaveBeenCalled();

    });

});

	