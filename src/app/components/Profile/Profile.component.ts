import { StorageService } from './../../services/storage.service';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OpenService } from '../../services/open.service';
import { environment } from '../../../environments/environment.development';
import { LoginService } from '../../services/login.service';
// import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.css']
})
export class ProfileComponent implements OnInit {

  bannerImages: string[] = [
  'assets/images/banners/b.jpg',
  'assets/images/banners/b1.jpg',
  'assets/images/banners/b2.jpg',
  'assets/images/banners/b4.jpg',
  'assets/images/banners/b5.jpg',
  'assets/images/banners/b6.webp'
];

  randomNumber : number = Math.floor(Math.random() * 6);
  userName: any;
  caption: any;
  serverEndPoint = environment.apiurl
  selectedFiles: File[] = [];
  visibleCommentIndexes = new Set<number>();
  // formService: any;
  // cdr: any;
  page = 0;
  size = 10;
  postList: any[]=[];
  customOptions = {
  loop: false,
  margin: 10,
  nav: true,
  dots: true,
  navText: ['‹', '›'],
  responsive: {
    0: {
      items: 1
    },
    768: {
      items: 1
    },
    1024: {
      items: 1
    }
  }
};
  sessionProfile: any;
  username: any;
  commentText: any;
  viewProfileFlag: boolean = false;
  friendsList: any[]  = [];




  constructor(private loginService : LoginService,private StorageService: StorageService,private formService: FormService, private router: Router,private cdr: ChangeDetectorRef,private spinner: NgxSpinnerService, private openService: OpenService, private activeroute: ActivatedRoute) {}
  currentSession : any;
   ngOnInit() {
    const currentUrl = this.router.url;
    console.log("currentUrl=>", currentUrl);
    if (currentUrl.includes('viewprofile')) {
      // Extract the username from the URL
      let userid = this.activeroute.snapshot.paramMap.get('userid');
      this.viewProfileFlag = true


      // console.log("username from URL=>", username);
      if (userid) {
       console.log("username found in the URL");
       this.loginService.getProfile(userid).subscribe({
        next: (data) => {
          console.log("profile data=>", data);
          this.loginService.getUser(userid).subscribe({
            next:(userData)=>{
              console.log("user data=>", userData);
              this.userName = userData.username;
              this.getPostByUsername()
            },error:(err)=>{
              console.error("Error fetching user data:", err);
            }
          })
          // this.username = data.username;
          this.currentSession = data
          this.sessionProfile = data;

          console.log("current session=>", this.currentSession);
          this.checkIfFollowing()
        },
        error: (err) => {
          console.error("Error fetching profile data:", err);
        }
      });
      } else {
        console.error("Username not found in the URL");
      }
    }else{
      this.viewProfileFlag = false
      this.sessionProfile = this.StorageService.getItem('profile');
      this.currentSession = this.StorageService.getItem("profile-page");
      this.userName = this.StorageService.getItem("username")
      console.log("username=>",this.userName)
      console.log("current session=>", this.currentSession)
      this.getPostByUsername()

    }


    // this.loadMore()

  }

  checkIfFollowing(): void {
    const currentUserId = this.currentSession?.userId;
    const friendUserIds = this.sessionProfile?.friendUserIds || [];

    this.toggleFollowButton = friendUserIds.includes(currentUserId);
    console.log("toggleFollowButton=>", this.toggleFollowButton);
  }
  gotoSetting() {
    // Logic to navigate to the settings page
    console.log('Navigating to settings...');
    // You can use Angular Router to navigate to the settings page
    this.router.navigate(['/settings']);
  }
  scaleDown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target) {
      target.style.transform = 'scale(0.90)';
    }
  }

  scaleUp(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target) {
      target.style.transform = 'scale(1)';
    }
  }

  isImage(url: string): boolean {
    return url?.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
  }

  isVideo(url: string): boolean {
    return url?.match(/\.(mp4|webm|ogg)$/i) != null;
  }

  toggleComments(index: number): void {
    if (this.visibleCommentIndexes.has(index)) {
      this.visibleCommentIndexes.delete(index);
    } else {
      this.visibleCommentIndexes.add(index);
      this.formService.getComments(this.postList[index].post.postId).subscribe({
        next: (data) => {
          this.postList[index].comments = data;
          console.log("comments=>",this.postList)
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
    isCommentVisible(index: number): boolean {
    return this.visibleCommentIndexes.has(index);
  }




 loadMore() {
    this.page++;
    console.log("page=>", this.page)
    // this.getAllPost(this.page, this.size)
    this.getPostByUsername()
  }

  onFilesSelected(event: any): void {
  const files: FileList = event.target.files;
  this.selectedFiles = Array.from(files);
}

getPostByUsername(){
  this.spinner.show();
  this.formService.getPostByUsername(this.userName, this.page, this.size).subscribe({
    next: (data) => {
      console.log("post by username=>", data);
      this.postList = this.postList.concat(data.content);
      this.StorageService.setItem("profile-page", this.currentSession);
      // console.log("session profile page=>", this.currentSession);
      console.log("postList=>", this.postList);
      this.spinner.hide();
    },
    error: (err: any) => {
      console.error(err);
      this.spinner.hide();
    }
  });
}


addComment(postId: string, index: number) {
  const payload = {
    postId: postId,
    username: this.userName,
    text: this.commentText,
  }
  console.log("payload=>", payload)
  // debugger
  this.formService.addComment(payload).subscribe({
    next: (data: any) => {
      console.log("comment=>", data)
      this.postList[index].comments.push(data);
      this.commentText = '';
    },
    error: (err: any) => {
      console.error(err)
    }
  })
}


  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `${count} ${key}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }


  updateProfilePictureFromInput(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Image = e.target.result;
      this.setProfilePicture(base64Image);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsDataURL(file);
  }
  setProfilePicture(base64Image: string): void {
    this.sessionProfile.profilePicture = base64Image;
    this.currentSession.profilePicture = base64Image;
    this.StorageService.setItem("profile", this.sessionProfile);

    this.loginService.postProfile(this.sessionProfile).subscribe({
      next: (data) => console.log("Profile updated successfully:", data),
      error: (err) => console.error("Error updating profile:", err)
    });
  }
  loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }

  toggleFollowButton: boolean = false;


  updateFriendsList(flag: boolean, friendId: string){
    let currentUserID = this.StorageService.getItem("userID");
    // let friendUserId = this.currentSession.userId;
    let friendUserId = friendId;
    this.formService.updateFriends(currentUserID, friendUserId, flag).subscribe({
      next: ( data: string)=>{
        console.log("update friends data=>", data);
        this.toggleFollowButton = !this.toggleFollowButton;
      },error: (err: any)=>{
        console.error("Error updating friends list:", err);
      }
    })
  }

  toggleFlag : boolean= false;
  toggletab(){
    this.toggleFlag = !this.toggleFlag;
  }

  getFriendsList( page: number, size: number){
    let userid = this.currentSession.userId;
    this.formService.getFriends(userid, page, size).subscribe({
      next: (data) => {
        console.log("friends list=>", data);
        this.friendsList = data.content;
        // this.StorageService.setItem("profile", this.currentSession);
      },
      error: (err) => {
        console.error("Error fetching friends list:", err);
      }
    });
  }
  friendPage: number = 0;
  loadMoreFriends() {
    this.friendPage++;
    console.log("friendPage=>", this.friendPage);
    this.getFriendsList(this.friendPage, this.size);
  }
}
