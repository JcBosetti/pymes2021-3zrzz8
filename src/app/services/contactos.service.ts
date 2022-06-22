import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contacto } from '../models/contacto';

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = environment.ConexionWebApiProxy + 'Contactos/';
  }
  get() {
    return this.httpClient.get(this.resourceUrl);
  }

  post(obj: Contacto) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

}
