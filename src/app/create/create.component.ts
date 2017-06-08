import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from './../news/services/firebase.service';

@Component({
	selector: 'create-news',
	templateUrl: 'create.component.html',
  styleUrls: ['create.component.scss'],
	providers: [
		FormBuilder,
		FirebaseService
	]
})
export class CreateComponent implements OnInit, OnDestroy {

  public createForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private firebase: FirebaseService) {}

  public ngOnInit() {
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    window.addEventListener('online', this.reload);

  }

  public ngOnDestroy() {
    window.removeEventListener('online', this.reload);
  }

  private reload() {
    location.reload()
  }

  public submitForm(): void {
    console.log((<any>navigator).onLine);

    let {title, content} = this.createForm.controls;

    this.firebase.addNews(title.value, content.value).subscribe(response => {
    	console.log(response);
    }, error => console.log(error));

    title.setValue('');
    content.setValue('');
  }

}
