import { HewsComponent } from './news.component';
import { TestBed } from '@angular/core/testing';

describe('NewsComponent', () => {

    let component: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
            	NewsComponent
            ],
            providers: [ ],
            imports: [ ]
        })

        fixture = TestBed.createComponent(NewsComponent);
        component = fixture.componentInstance;
    });

    it('component should be defined', () => {
		expect(component).toBeDefined();
    });

});

	