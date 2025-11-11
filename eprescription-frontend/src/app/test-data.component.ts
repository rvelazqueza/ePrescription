import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from './services/patient.service';
import { PatientData } from './interfaces/patient.interface';

@Component({
  selector: 'app-test-data',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Test de Datos Mock</h2>
      
      <div class="mb-4">
        <button (click)="testRecentPatients()" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Test Recent Patients
        </button>
        <button (click)="testPatientById()" class="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Test Patient By ID
        </button>
        <button (click)="testSearchPatients()" class="bg-purple-500 text-white px-4 py-2 rounded">
          Test Search Patients
        </button>
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h3 class="font-bold mb-2">Resultados:</h3>
        <pre class="text-sm">{{ results | json }}</pre>
      </div>

      <div class="mt-4" *ngIf="patients.length > 0">
        <h3 class="font-bold mb-2">Pacientes Cargados ({{ patients.length }}):</h3>
        <div class="grid gap-2">
          <div *ngFor="let patient of patients" class="bg-white p-2 rounded border">
            <strong>{{ patient.fullName }}</strong> - {{ patient.idNumber }} - {{ patient.phone }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestDataComponent implements OnInit {
  patients: PatientData[] = [];
  results: any = {};

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    console.log('TestDataComponent initialized');
    this.testRecentPatients();
  }

  testRecentPatients() {
    console.log('Testing recent patients...');
    this.patientService.getRecentPatients().subscribe({
      next: (patients) => {
        console.log('Recent patients loaded:', patients);
        this.patients = patients;
        this.results = {
          type: 'Recent Patients',
          count: patients.length,
          success: true,
          data: patients.slice(0, 3) // Show first 3
        };
      },
      error: (error) => {
        console.error('Error loading recent patients:', error);
        this.results = {
          type: 'Recent Patients',
          success: false,
          error: error.message
        };
      }
    });
  }

  testPatientById() {
    console.log('Testing patient by ID...');
    this.patientService.getPatientById('1').subscribe({
      next: (patient) => {
        console.log('Patient by ID loaded:', patient);
        this.results = {
          type: 'Patient By ID',
          success: true,
          data: patient
        };
      },
      error: (error) => {
        console.error('Error loading patient by ID:', error);
        this.results = {
          type: 'Patient By ID',
          success: false,
          error: error.message
        };
      }
    });
  }

  testSearchPatients() {
    console.log('Testing search patients...');
    this.patientService.searchPatients('María', 'name').subscribe({
      next: (result) => {
        console.log('Search results:', result);
        this.results = {
          type: 'Search Patients',
          success: true,
          data: result
        };
      },
      error: (error) => {
        console.error('Error searching patients:', error);
        this.results = {
          type: 'Search Patients',
          success: false,
          error: error.message
        };
      }
    });
  }
}