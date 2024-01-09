import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { getPaginationHeaders, getPaginationResult } from './paginationHepler';
import { Message } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl=environment.apiUrl;

  constructor(private http:HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string){
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append("Container", container);
    return getPaginationResult<Message[]>(this.baseUrl+"messages", params, this.http)
  }

  getMessageThread(username:string){
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
  } 
}
