import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from './login-request';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink, 
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup; //Will be defined
  
  constructor(private authService:AuthService, private router:Router){}

  ngOnInit(): void {
    //Initialize Form
    this.form = new FormGroup({
      userName: new FormControl("", Validators.required), //Makes fom required
      password: new FormControl("", Validators.required) //Makes fom required
    });
  }

  onSubmit() {
    let loginRequest = <LoginRequest>{
      userName: this.form.controls['userName'].value,
      password: this.form.controls['password'].value
    };

  this.authService.login(loginRequest).subscribe({
    next: (res) =>{
      if (res.success){
        this.router.navigate(["/"]);
      }
    },
    error: (e) => console.error(e)
  });
  };
}