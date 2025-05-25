import { StorageService } from './../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-Settings',
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.css']
})
export class SettingsComponent implements OnInit {
activeTab: string = 'account';
payload: any ={
  firstName:'',
  lastName:'',
  userId: ''
};
  useProfile: any;
  userId: any;

ontabChange(tab: string) {
    this.activeTab = tab;

  }
  constructor( private loginService: LoginService, private storageService: StorageService) { }

  ngOnInit() {
    this.useProfile = this.storageService.getItem("profile")
    this.userId = this.storageService.getItem("userID")
    console.log("usrProfile=>", this.useProfile);
    console.log("userID=>", this.userId)
    this.payload.useId = this.userId;
    // this.payload = this.useProfile
    // console.log("payload=>", this.payload)
  }

  createAndUpdateProfile(){
    console.log('payload=>', this.useProfile);
    // debugger
    this.loginService.postProfile(this.useProfile).subscribe((data)=>{
      console.log("c and u = > ", data)
      this.storageService.setItem("profile", data)
    });

  }
}
