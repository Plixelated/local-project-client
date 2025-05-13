import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from './login-request';
import { AuthService } from './auth.service';
import { RegisterRequest } from './register-request';
import { environment } from '../../environments/environment';
import { OriginID } from '../origin-id';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink, 
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup; //Will be defined
  
  constructor(private authService:AuthService, private router:Router, private http:HttpClient){}

  public success: boolean = false;

  ngOnInit(): void {
    //Initialize Form
    this.form = new FormGroup({
      email: new FormControl("", Validators.required),
      userName: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  onSubmit() {
    let registerRequest = <RegisterRequest>{
      userName: this.form.controls['userName'].value,
      password: this.form.controls['password'].value,
      email: this.form.controls['email'].value,
      originID: localStorage.getItem("DESubToken")
    };

    this.authService.register(registerRequest).subscribe({
      next: (res) =>{
        if (res.success){
          this.form.controls['userName'].reset();
          this.form.controls['password'].reset();
          this.form.controls['email'].reset();
          this.success = true;

          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000);
        }
      },
      error: (e) => console.error(e)
    });
    };
}