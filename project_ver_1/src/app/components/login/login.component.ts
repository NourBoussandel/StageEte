import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validationform';
import { NgToastService } from 'ng-angular-popup';
//import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
   // private userStore: UserStoreService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
     
      email: ['', Validators.required],
      mot_de_passe: ['', Validators.required],
      
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onlogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.auth.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res.message);
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          localStorage.setItem("currentUser",JSON.stringify(tokenPayload));

          //this.toast.success({detail:"SUCCESS", summary:res.message, duration: 5000});
          if(this.auth.getUser().role=="employe")
             this.router.navigate(['accueil_collab']);
            else{
              if(this.auth.getUser().role=="manager")
              {this.router.navigate(['accueil_manager']);}
            }
        
        },
        error: (err) => {
         // this.toast.error({detail:"ERROR", summary:"Something when wrong!", duration: 5000});
          console.log(err);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}