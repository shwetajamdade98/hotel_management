import { Component, OnInit , ViewChild} from '@angular/core';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import{ Feedback,ContactType }from '../shared/feedback';
import { flyInOut }from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]':'true',
    'style': 'display:block;'
  },
  animations:[
    flyInOut()
  ]
})

export class ContactComponent implements OnInit {
  feedbackForm:FormGroup;
  feedback:Feedback;
  contacttype=ContactType;
  @ViewChild ('fform',{static:false}) feedbackFormDirective;

  formErrors = {
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages = {
    'firstname':{
      'required':'First name is required.',
      'minlength':'First name  must be atleast 2 characters long',
      'maxlength':'First name cannot be more than 25 characters long'
    },
    'lastname':{
      'required':'Last name is required.',
      'minlength':'Last name  must be atleast 2 characters long',
      'maxlength':'Last name cannot be more than 25 characters long'
    },
    'telnum':{
      'required':'Tel. number is required',
      'pattern':'Tel. number must contain only numbers',
    },
      'email':{
        'required':'Email is required',
        'email':'Email not in invalid format'
      },
  };

  constructor(private fb: FormBuilder) {
    this.createForm();

}
  ngOnInit() {
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname:['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname:['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum:[0,[ Validators.required, Validators.pattern]],
      email:['', [Validators.required, Validators.email]],
      agree:false,
      contacttype:'None',
      meassage:''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //reset form validation message
  }

  onValueChanged(data?: any){
    if (!this.feedbackForm){ return; }
    const form = this.feedbackForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)) {
        // clear previous errormessage (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
       firstname:'',
       lastname:'',
       telnum:0,
       email: '',
       agree: false,
       contacttype:'None',
       message:''
    });
    this.feedbackFormDirective.resetForm();

  }

}
