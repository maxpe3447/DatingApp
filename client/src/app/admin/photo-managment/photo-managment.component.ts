import { Component, OnInit, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Photo } from '../../model/photo';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-photo-managment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-managment.component.html',
  styleUrl: './photo-managment.component.css'
})
export class PhotoManagmentComponent implements OnInit{

  photos:Photo[] = [];

  constructor(private adminService:AdminService){}
  ngOnInit(): void {
    this.getPhotosForApproval();    
  }

  getPhotosForApproval(){
    this.adminService.getPhotoForApproval().subscribe({
      next: photos => this.photos = photos
    })
  }

  approvalPhoto(photoId: number){
    this.adminService.approvePhoto(photoId).subscribe({
      next: ()=>this.photos.splice(this.photos.findIndex(p=>p.id === photoId), 1)
    })
  }

  rejectPhoto(photoId: number){
    this.adminService.rejectPhoto(photoId).subscribe({
      next: ()=> this.photos.splice(this.photos.findIndex(p=>p.id === photoId, 1))
    })
  }

}
