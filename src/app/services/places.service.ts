import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place } from '../models/place.model';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  constructor(private http: HttpClient) {}

  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>('http://ec2-54-221-160-23.compute-1.amazonaws.com/api/cafes');
  }

}
