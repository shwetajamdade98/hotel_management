import { Component, OnInit, ViewChild,Inject} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location} from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService}from '../services/dish.service';
import { switchMap} from 'rxjs/operators';
import { Comment } from '@angular/compiler';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';
import { visibility, flyInOut, expand }from '../animations/app.animation';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]':'true',
    'style': 'display:block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {


  dish:Dish;
  errMess: string;
  dishIds: string[];
  dishErrMess:string;
  prev: string;
  next: string;
  @ViewChild('cform') commentFormDirective;
  comment: Comment;
  commentForm: FormGroup;
  dishcopy:Dish;
  visibility = 'shown';

  formErrors = {
    'author':'',
    'comment':''
  };

  ValidationMessages = {
    'author':{
      'required' :    'Author Name is required.',
      'minlegth' :    'Author Name ,ust be at least 2 characters',

    },
    'comment':{
      'required' :   'Comment is required.'
    }
  };


  constructor(private dishService:DishService,
               private route:ActivatedRoute,
              private location:Location,
              private fb:FormBuilder,
              @Inject('BaseURL')private BaseURL) { }

  ngOnInit() {
    this.createForm();

    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
    .pipe(switchMap((params: Params) => {this.visibility ='hidden';return  this.dishService.getDish(params['id']); }))
   .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
   errmess => this.errMess = <any>errmess );
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds [(this.dishIds.length + index - 1) % this.dishIds.length];
    this.prev = this.dishIds [(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack():void {
    this.location.back();
  }
  createForm() {
    this.commentForm = this.fb.group({
      author: ['',[Validators.required, Validators.minLength]],
      rating: 5,
      comment: ['',Validators.required]
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
       this.dish = dish; this.dishcopy = dish;
    },
    errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating:5,
      comment:''
    });
  }
   onValueChanged(data?: any){
     if(!this.commentForm){ return }
   }

}
