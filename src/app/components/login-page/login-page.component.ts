
import { Route, Routes } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


// import { CommonEngine } from '@angular/ssr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {

confirmPassword: any;
passwordMismatch: boolean = false;
  useProfile: any;
  userId: any;
  payload: any;



  constructor(private storageService: StorageService, private loginService: LoginService, private router: Router, private http: HttpClient) {}
  loginData :any = {};
  isLoggedIn: boolean = false;
  signupData : any = {};
  profileData : any = {};
  flag: boolean = false;
  ngOnInit(): void {
    // Initialize any data or perform actions when the component is loaded
    this.isLoggedIn = this.loginService.isAuthenticated();

     this.useProfile = this.storageService.getItem("profile")
    this.userId = this.storageService.getItem("userID")
    console.log("usrProfile=>", this.useProfile);
    console.log("userID=>", this.userId)
  }
  toggleFlag(){
    console.log("flag", this.flag)
    this.flag = !this.flag;
  }

  defaultImageBytes: number[] = [];

loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(xhr.response);  // this gives base64
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

// base64ToByteArray(base64: string): number[] {
//   const base64Data = base64.split(',')[1];  // remove data:image/... prefix
//   const binaryString = atob(base64Data);
//   const byteArray = new Uint8Array(binaryString.length);
//   for (let i = 0; i < binaryString.length; i++) {
//     byteArray[i] = binaryString.charCodeAt(i);
//   }
//   return Array.from(byteArray);
// }


  loginError: boolean = false;

onLogin(form: NgForm) {
  console.log('Login Data:', this.loginData);
  this.loginError = false;

  if (form.invalid) {
    Object.values(form.controls).forEach(control => control.markAsTouched());
    return;
  }

  this.loginService.login(this.loginData).subscribe({
   next: (response) => {
      console.log('Login successful:', response);
      this.loginService.storeToken(response.token);

      // this.router.navigate(['/home']);
    },
    error:(error) => {
      if (error.status === 401) {
        console.error('Invalid username or password');
        this.loginError = true;

        // Mark fields as touched to trigger validation styling
        form.controls['loginEmail'].markAsTouched();
        form.controls['loginPassword'].markAsTouched();
      } else {
        console.error('Login failed:', error);
      }
    }}
  );
}

usernameExists: boolean = false;

onSignup(signupForm: NgForm) {
  this.usernameExists = false;

  if (signupForm.invalid) {
    Object.values(signupForm.controls).forEach(control => {
      (control as AbstractControl).markAsTouched();
    });
    return;
  }
  if (this.signupData.password !== this.confirmPassword) {
    this.passwordMismatch = true;
    return;
  } else {
    this.passwordMismatch = false;
  }

  console.log('Signup Data:', this.signupData);

  this.loginService.signup(this.signupData).subscribe({
    next: async (response) => {
      console.log('Signup successful:', response);
      let base64Image = await this.loadImageAsBase64('assets/images/149071.png');
      console.log("base64images=>",base64Image)
        // const imageBytes = this.base64ToByteArray(base64Image);

      const credentials = {
        username: this.signupData.username,
        password: this.signupData.password
      };

      const payload = {
        userId: response.id,
        firstName: this.profileData.firstName,
        lastName: this.profileData.lastName,
        email: this.signupData.email,
        description: "Hi, Im new to Kitchen",
        profilePicture: base64Image,
      }
      console.log("payload",payload)
      // this.loginService.postProfile(payload).subscribe((data)=>{
      //   console.log("postProile response", data)
      // })

      this.loginService.login(credentials).subscribe({
        next: (loginResponse) => {
          console.log('Login successful:', loginResponse);
          this.loginService.storeToken(loginResponse.token);
          this.loginService.postProfile(payload).subscribe((data)=>{
          console.log("postProile response", data)
          this.storageService.setItem("profile", data)
        })
          this.router.navigate(['/home']);
        },
        error: (loginError) => {
          console.error('Login failed:', loginError);
        }
      });
    },
    error: (error) => {
      if (error.status === 409) {
        console.error('Username already exists:', error.error);
        this.usernameExists = true;

        // Optionally mark username field as touched again
        signupForm.controls['signupName'].markAsTouched();
      } else {
        console.error('Signup failed:', error);
      }
    }
  });
}

//  createAndUpdateProfile(){
//     this.payload.email =
//     this.loginService.postProfile(this.payload).subscribe((data)=>{
//       console.log("c and u = > ", data)
//       this.storageService.setItem("profile", data)
//     });

//   }
  logout() {
    this.loginService.logout();
  }

}
