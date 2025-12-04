import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/api/doctors`;

  constructor(private http: HttpClient) {}

  // Temporary methods for compatibility
  getDoctors(): Observable<any[]> {
    return of([]);
  }

  updateDoctor(id: string, doctor: any): Observable<any> {
    return of({ success: true });
  }

  deleteDoctor(id: string): Observable<any> {
    return of({ success: true });
  }
}
