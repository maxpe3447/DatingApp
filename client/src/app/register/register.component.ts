import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup =new FormGroup({});
  constructor(private accountService: AccountService,
    private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.initializeFotm();
  }

  initializeFotm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    });
    // this.registerForm.controls['password'].valueChanges.subscribe({
    //   next: ()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    // })
  }
  matchValues(matchTo: string):ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }
  register() {
    console.log(this.registerForm.value);
    
    // this.accountService.register(this.model).subscribe({
    //   next: () => {
    //     this.cancel();
    //   },
    //   error: error => this.toastr.error(error.error)
    // });
  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
