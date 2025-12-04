import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// DTOs matching backend
export interface DrugInteractionRequest {
  medicationIds: string[];
}

export interface DrugInteraction {
  medication1Id: string;
  medication1Name: string;
  medication2Id: string;
  medication2Name: string;
  interactionType: string; // MAJOR, MODERATE, MINOR
  severity: string; // HIGH, MEDIUM, LOW
  description: string;
  clinicalEffect?: string;
  managementRecommendation?: string;
  references: string[];
}

export interface ClinicalAnalysisRequest {
  clinicalDescription: string;
  patientId?: string;
}

export interface DiagnosisSuggestion {
  cie10Code: string;
  description: string;
  confidence: number;
  isValidated: boolean;
  validationMessage?: string;
  supportingSymptoms: string[];
}

export interface ClinicalAnalysisResult {
  originalDescription: string;
  translatedDescription: string;
  diagnosisSuggestions: DiagnosisSuggestion[];
  symptoms: string[];
  confidenceScore: number;
  aiModel: string;
  analysisDate: string;
  analysisLogId?: string;
}

export interface MedicationRecommendationRequest {
  diagnosisCodes: string[];
  patientAge?: number;
  patientWeight?: number;
  allergies?: string[];
}

export interface MedicationRecommendation {
  medicationName: string;
  activeIngredient: string;
  recommendedDosage: string;
  frequency: string;
  duration: string;
  route: string;
  indications: string[];
  contraindications: string[];
  confidenceScore: number;
  specialInstructions?: string;
  requiresPrescription: boolean;
}

export interface ContraindicationRequest {
  medicationIds: string[];
  patientId: string;
  diagnosisCodes?: string[];
}

export interface Contraindication {
  medicationId: string;
  medicationName: string;
  contraindicationType: string; // ALLERGY, CONDITION, AGE, PREGNANCY
  reason: string;
  severity: string; // ABSOLUTE, RELATIVE
  alternativeSuggestion?: string;
}

export interface ContraindicationResult {
  hasContraindications: boolean;
  contraindications: Contraindication[];
  warnings: string[];
  isSafeToDispense: boolean;
  recommendedAction?: string;
}

export interface QuickDiagnosisRequest {
  symptoms: string[];
}

export interface QuickDiagnosisResult {
  symptoms: string[];
  suggestedDiagnoses: DiagnosisSuggestion[];
  confidenceScore: number;
  analysisDate: string;
}

export interface AIAnalysisLogDto {
  id: string;
  analysisDate: string;
  clinicalDescription: string;
  aiResponse: string;
  suggestedDiagnoses: string[];
  confidenceScore: number;
  aiModel: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private apiUrl = `${environment.apiUrl}/api/AIAssistant`;

  constructor(private http: HttpClient) {}

  /**
   * Check for drug interactions between medications
   * Endpoint: POST /api/AIAssistant/medications/check-interactions
   */
  checkDrugInteractions(medicationIds: string[]): Observable<DrugInteraction[]> {
    const request: DrugInteractionRequest = { medicationIds };
    return this.http.post<DrugInteraction[]>(
      `${this.apiUrl}/medications/check-interactions`,
      request
    );
  }

  /**
   * Analyze clinical description and suggest diagnoses with CIE-10 codes
   * Endpoint: POST /api/AIAssistant/analyze
   */
  analyzeClinicalDescription(
    clinicalDescription: string,
    patientId?: string
  ): Observable<ClinicalAnalysisResult> {
    const request: ClinicalAnalysisRequest = {
      clinicalDescription,
      patientId
    };
    return this.http.post<ClinicalAnalysisResult>(
      `${this.apiUrl}/analyze`,
      request
    );
  }

  /**
   * Generate medication recommendations based on diagnoses
   * Endpoint: POST /api/AIAssistant/medications/recommend
   */
  generateMedicationRecommendations(
    request: MedicationRecommendationRequest
  ): Observable<MedicationRecommendation[]> {
    return this.http.post<MedicationRecommendation[]>(
      `${this.apiUrl}/medications/recommend`,
      request
    );
  }

  /**
   * Validate contraindications for a patient
   * Endpoint: POST /api/AIAssistant/medications/check-contraindications
   */
  checkContraindications(
    request: ContraindicationRequest
  ): Observable<ContraindicationResult> {
    return this.http.post<ContraindicationResult>(
      `${this.apiUrl}/medications/check-contraindications`,
      request
    );
  }

  /**
   * Quick diagnosis suggestion based on symptoms
   * Endpoint: POST /api/AIAssistant/quick-diagnosis
   */
  quickDiagnosis(symptoms: string[]): Observable<QuickDiagnosisResult> {
    const request: QuickDiagnosisRequest = { symptoms };
    return this.http.post<QuickDiagnosisResult>(
      `${this.apiUrl}/quick-diagnosis`,
      request
    );
  }

  /**
   * Get AI analysis history for a patient
   * Endpoint: GET /api/AIAssistant/history/{patientId}
   */
  getAnalysisHistory(patientId: string, limit: number = 10): Observable<AIAnalysisLogDto[]> {
    return this.http.get<AIAnalysisLogDto[]>(
      `${this.apiUrl}/history/${patientId}?limit=${limit}`
    );
  }
}
