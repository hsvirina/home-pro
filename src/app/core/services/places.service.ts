import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Place } from '../models/place.model';
import { API_ENDPOINTS } from '../../environments/api-endpoints';

/**
 * Service responsible for fetching places data from the backend API.
 * Supports language-based filtering via query parameters.
 */
@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly baseUrl = API_ENDPOINTS.places.list;

  constructor(private http: HttpClient) {}

  /**
   * Fetches an array of places filtered by the specified language.
   * Defaults to English ('en') if no language is provided.
   *
   * @param lang - Language code for localization (e.g. 'en', 'uk')
   * @returns Observable emitting an array of Place objects
   */
  getPlaces(lang: string = 'en'): Observable<Place[]> {
    const params = new HttpParams().set('lang', lang);
    return this.http.get<Place[]>(this.baseUrl, { params });
  }
}
