import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Member } from '../model/member';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../model/pagination';
import { UserParams } from '../model/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge',userParams.minAge );
    params = params.append('maxAge',userParams.maxAge );
    params = params.append('gender',userParams.gender );
    params = params.append('orderBy',userParams.orderBy );

    return this.getPaginationResult<Member[]>(this.baseUrl + 'users', params);
  }

  private getPaginationResult<T>(url:string, params: HttpParams) {   
    const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {

        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize:number) {
    let params = new HttpParams();

      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
  
    return params;
  }

  getMember(userName: string) {
    const member = this.members.find(x => x.userName === userName);
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + "users/" + userName);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + "users", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
