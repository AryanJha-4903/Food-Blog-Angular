import { OpenService } from './../../services/open.service';
import { StorageService } from './../../services/storage.service';

import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormService } from '../../services/form.service';
import { environment } from '../../../environments/environment.development';
import { NavigationEnd, Router } from '@angular/router';
import { get } from 'http';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, switchMap } from 'rxjs';
import { ngxLoadingAnimationTypes } from 'ngx-loading';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,AfterViewInit {

  page = 0;
  size = 10;
  sessionProfile: any;
  postList: any[] = [];
  serverEndPoint = environment.apiurl
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
commentText: any;
  username: any;
caption: any;
weatherData: any;
loadingConfig = {
    animationType: ngxLoadingAnimationTypes.circle, // or rotatingPlane, cubeGrid, etc.
    backdropBackgroundColour: 'rgba(255, 255, 255, 0.8)', // white background with slight transparency
    backdropBorderRadius: '10px',
    primaryColour: '#000000',   // spinner color
    secondaryColour: '#000000',
    tertiaryColour: '#000000'
  };
  // loading: boolean = true;

  constructor(private StorageService: StorageService,private formService: FormService, private router: Router,private cdr: ChangeDetectorRef,private spinner: NgxSpinnerService, private openService: OpenService) {}

  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd: ', event.url);
      }
    });
    this.sessionProfile = this.StorageService.getItem('profile');
    this.username = this.StorageService.getItem('username')
    console.log("SessionID",this.sessionProfile);
    this.getAllPost(this.page, this.size);
    this.getThirdSectionData();
    // console.log("weatherData=>", this.weatherData)
  }

  visibleCommentIndexes = new Set<number>();

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


  getAllPost(page: number , size: number ) {
     this.spinner.show();
    this.formService.getRandomPost(page, size).subscribe({
      next: (data)=>{
        console.log("post=>",data)
        this.postList = this.postList.concat(data.content);
        this.spinner.hide();
      },
      error: (err)=>{
        console.error(err)
        this.spinner.hide();
      }
    })
  }

  loadMore() {
    this.page++;
    console.log("page=>", this.page)
    this.getAllPost(this.page, this.size)
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

isImage(url: string): boolean {
  return url?.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
}

isVideo(url: string): boolean {
  return url?.match(/\.(mp4|webm|ogg)$/i) != null;
}

addComment(postId: string, index: number) {
  const payload = {
    postId: postId,
    username: this.username,
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

updateLike(postId:string, index:number, increment:boolean){
  let payload = {
    postId: postId,
    userId: this.StorageService.getItem('userID'),
    increment: increment
  }
  console.log("like payload=>", payload)
  this.formService.updatelike(payload).subscribe({
    next:(data: any)=>{
      this.postList[index].post.like = data.like;
            // Toggle likedPostIds based on increment flag
      if (increment== false) {
        const likedIndex = this.sessionProfile.likedPostIds.indexOf(postId);
        if (likedIndex > -1) {
          this.sessionProfile.likedPostIds.splice(likedIndex, 1); // Remove
          this.StorageService.setItem('profile', this.sessionProfile);
          console.log("update sessionProfile=>", this.sessionProfile);
        }
      } else {
        this.sessionProfile.likedPostIds.push(postId); // Add
        this.StorageService.setItem('profile', this.sessionProfile);
        console.log("update sessionProfile=>", this.sessionProfile);
      }
    },
    error:(err: any)=>{
      console.error(err)
    }
  });
}

// caption: string = '';
selectedFiles: File[] = [];

onFilesSelected(event: any): void {
  const files: FileList = event.target.files;
  this.selectedFiles = Array.from(files);
}

submitPost(): void {
  const formData = new FormData();
  formData.append('username', this.username);
  formData.append('caption', this.caption.trim());

  this.selectedFiles.forEach(file => {
    formData.append('files', file); // Same key 'files' for each file
  });
  console.log("formData=>", formData.getAll('files'), formData.get('caption'), formData.get('username'))

  this.formService.createPost(formData).subscribe({
    next: (data: any)=>{
      console.log("post=>", data)
      // this.postList.unshift(data);
      this.loadMore();
      this.cdr.detectChanges();
      this.selectedFiles = [];
      this.caption = '';
    },error: (err: any)=>{
      console.error(err);
    }
  });

}
isLiked(postId: string): boolean {
  return this.sessionProfile?.likedPostIds?.includes(postId);
}

sectionLoading :boolean = true

  getThirdSectionData(){
    this.openService.getIpAddress().pipe(
    switchMap(ip =>
      this.openService.getWeatherData(ip.latitude, ip.longitude).pipe(
        // Combine IP and Weather in final result
        map(weather => ({ ...ip, ...weather }))
      )
    )
  ).subscribe({
    next: (data) => {

      this.weatherData = data;
      this.sectionLoading = false;
      console.log('Combined data:', this.weatherData);
    },
    error: (error) => {
      console.error('Error fetching data:', error);
      this.sectionLoading = false;
    }
  });
  }

  getWeatherIcon(code: number): string {
    return this.openService.getWeatherIcon(code);
  }

  gotoviewProfile(userid: string) {
    // this.StorageService.setItem('viewProfile', userid);
    this.router.navigate(['/viewprofile', userid]);
  }
}
