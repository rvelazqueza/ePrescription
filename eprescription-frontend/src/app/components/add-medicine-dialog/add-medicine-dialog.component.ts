import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../ui/dialog/dialog.component';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { LabelComponent } from '../ui/label/label.component';
import { TextareaComponent } from '../ui/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../ui/select/select.component';

export interface Medicine {
  id?: string;
  name: string;
  quantity: string;
  dose: string;
  frequency: string;
  administration: string;
  duration: string;
  observations?: string;
}

@Component({
  selector: 'app-add-medicine-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogContentComponent,
    DialogFooterComponent,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    TextareaComponent,
    SelectComponent
  ],
  template: `
    <app-dialog [open]="isOpen" (openChange)="onOpenChange($event)" contentClass="max-w-md fixed right-0 top-0 h-full m-0 rounded-l-lg rounded-r-none">
      <app-dialog-header>
        <app-dialog-title>Agregar Medicamento</app-dialog-title>
      </app-dialog-header>
      
      <app-dialog-content>
        <form [formGroup]="medicineForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <app-label>Medicamento *</app-label>
            <app-select
              [options]="medicineOptions"
              placeholder="Seleccione un medicamento"
              formControlName="name"
              [hasError]="isFieldInvalid('name')"
            ></app-select>
            <div *ngIf="isFieldInvalid('name')" class="text-sm text-red-500 mt-1">
              El medicamento es requerido
            </div>
          </div>

          <div>
            <app-label>Cantidad *</app-label>
            <app-input
              placeholder="ej. 15 tabletas"
              formControlName="quantity"
              [hasError]="isFieldInvalid('quantity')"
            ></app-input>
            <div *ngIf="isFieldInvalid('quantity')" class="text-sm text-red-500 mt-1">
              La cantidad es requerida
            </div>
          </div>

          <div>
            <app-label>Dosis *</app-label>
            <app-input
              placeholder="ej. 400 mg"
              formControlName="dose"
              [hasError]="isFieldInvalid('dose')"
            ></app-input>
            <div *ngIf="isFieldInvalid('dose')" class="text-sm text-red-500 mt-1">
              La dosis es requerida
            </div>
          </div>

          <div>
            <app-label>Frecuencia *</app-label>
            <app-select
              [options]="frequencyOptions"
              placeholder="Seleccione la frecuencia"
              formControlName="frequency"
              [hasError]="isFieldInvalid('frequency')"
            ></app-select>
            <div *ngIf="isFieldInvalid('frequency')" class="text-sm text-red-500 mt-1">
              La frecuencia es requerida
            </div>
          </div>

          <div>
            <app-label>Vía de Administración *</app-label>
            <app-select
              [options]="administrationOptions"
              placeholder="Seleccione la vía"
              formControlName="administration"
              [hasError]="isFieldInvalid('administration')"
            ></app-select>
            <div *ngIf="isFieldInvalid('administration')" class="text-sm text-red-500 mt-1">
              La vía de administración es requerida
            </div>
          </div>

          <div>
            <app-label>Duración *</app-label>
            <app-input
              placeholder="ej. 5 días"
              formControlName="duration"
              [hasError]="isFieldInvalid('duration')"
            ></app-input>
            <div *ngIf="isFieldInvalid('duration')" class="text-sm text-red-500 mt-1">
              La duración es requerida
            </div>
          </div>

          <div>
            <app-label>Observaciones</app-label>
            <app-textarea
              placeholder="Observaciones adicionales..."
              [rows]="3"
              formControlName="observations"
            ></app-textarea>
          </div>
        </form>
      </app-dialog-content>

      <app-dialog-footer>
        <app-button variant="outline" type="button" (click)="onCancel()">
          Cancelar
        </app-button>
        <app-button type="button" (click)="onSubmit()">
          Agregar Medicamento
        </app-button>
      </app-dialog-footer>
    </app-dialog>
  `
})
export class AddMedicineDialogComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<Medicine>();

  medicineForm: FormGroup;

  medicineOptions: SelectOption[] = [
    // Analgésicos y Antiinflamatorios
    { value: 'Paracetamol (Acetaminofén)', label: 'Paracetamol (Acetaminofén)' },
    { value: 'Ibuprofeno', label: 'Ibuprofeno' },
    { value: 'Diclofenaco', label: 'Diclofenaco' },
    { value: 'Naproxeno', label: 'Naproxeno' },
    { value: 'Ácido Acetilsalicílico (Aspirina)', label: 'Ácido Acetilsalicílico (Aspirina)' },
    { value: 'Ketorolaco', label: 'Ketorolaco' },
    
    // Antibióticos
    { value: 'Amoxicilina', label: 'Amoxicilina' },
    { value: 'Amoxicilina + Ácido Clavulánico', label: 'Amoxicilina + Ácido Clavulánico' },
    { value: 'Azitromicina', label: 'Azitromicina' },
    { value: 'Ciprofloxacina', label: 'Ciprofloxacina' },
    { value: 'Cefalexina', label: 'Cefalexina' },
    { value: 'Clindamicina', label: 'Clindamicina' },
    { value: 'Doxiciclina', label: 'Doxiciclina' },
    
    // Cardiovasculares
    { value: 'Enalapril', label: 'Enalapril' },
    { value: 'Losartán', label: 'Losartán' },
    { value: 'Amlodipino', label: 'Amlodipino' },
    { value: 'Atenolol', label: 'Atenolol' },
    { value: 'Metoprolol', label: 'Metoprolol' },
    { value: 'Hidroclorotiazida', label: 'Hidroclorotiazida' },
    { value: 'Furosemida', label: 'Furosemida' },
    
    // Gastrointestinales
    { value: 'Omeprazol', label: 'Omeprazol' },
    { value: 'Pantoprazol', label: 'Pantoprazol' },
    { value: 'Ranitidina', label: 'Ranitidina' },
    { value: 'Sucralfato', label: 'Sucralfato' },
    { value: 'Domperidona', label: 'Domperidona' },
    { value: 'Loperamida', label: 'Loperamida' },
    
    // Diabetes
    { value: 'Metformina', label: 'Metformina' },
    { value: 'Glibenclamida', label: 'Glibenclamida' },
    { value: 'Insulina NPH', label: 'Insulina NPH' },
    { value: 'Insulina Rápida', label: 'Insulina Rápida' },
    
    // Colesterol
    { value: 'Atorvastatina', label: 'Atorvastatina' },
    { value: 'Simvastatina', label: 'Simvastatina' },
    { value: 'Rosuvastatina', label: 'Rosuvastatina' },
    
    // Respiratorios
    { value: 'Salbutamol', label: 'Salbutamol' },
    { value: 'Beclometasona', label: 'Beclometasona' },
    { value: 'Loratadina', label: 'Loratadina' },
    { value: 'Cetirizina', label: 'Cetirizina' },
    { value: 'Dextrometorfano', label: 'Dextrometorfano' },
    
    // Neurológicos y Psiquiátricos
    { value: 'Alprazolam', label: 'Alprazolam' },
    { value: 'Diazepam', label: 'Diazepam' },
    { value: 'Sertralina', label: 'Sertralina' },
    { value: 'Fluoxetina', label: 'Fluoxetina' },
    { value: 'Carbamazepina', label: 'Carbamazepina' },
    { value: 'Fenitoína', label: 'Fenitoína' },
    
    // Otros
    { value: 'Levotiroxina', label: 'Levotiroxina' },
    { value: 'Prednisona', label: 'Prednisona' },
    { value: 'Alopurinol', label: 'Alopurinol' },
    { value: 'Warfarina', label: 'Warfarina' }
  ];

  frequencyOptions: SelectOption[] = [
    { value: 'Una vez al día (QD)', label: 'Una vez al día (QD)' },
    { value: 'Dos veces al día (BID)', label: 'Dos veces al día (BID)' },
    { value: 'Tres veces al día (TID)', label: 'Tres veces al día (TID)' },
    { value: 'Cuatro veces al día (QID)', label: 'Cuatro veces al día (QID)' },
    { value: 'Cada 4 horas', label: 'Cada 4 horas' },
    { value: 'Cada 6 horas', label: 'Cada 6 horas' },
    { value: 'Cada 8 horas', label: 'Cada 8 horas' },
    { value: 'Cada 12 horas', label: 'Cada 12 horas' },
    { value: 'Cada 24 horas', label: 'Cada 24 horas' },
    { value: 'Con las comidas', label: 'Con las comidas' },
    { value: 'Antes de las comidas', label: 'Antes de las comidas' },
    { value: 'Después de las comidas', label: 'Después de las comidas' },
    { value: 'Al acostarse', label: 'Al acostarse' },
    { value: 'En ayunas', label: 'En ayunas' },
    { value: 'Según necesidad (PRN)', label: 'Según necesidad (PRN)' },
    { value: 'Cada semana', label: 'Cada semana' },
    { value: 'Cada mes', label: 'Cada mes' }
  ];

  administrationOptions: SelectOption[] = [
    { value: 'Oral', label: 'Oral' },
    { value: 'Sublingual', label: 'Sublingual' },
    { value: 'Tópica', label: 'Tópica' },
    { value: 'Intramuscular', label: 'Intramuscular' },
    { value: 'Intravenosa', label: 'Intravenosa' },
    { value: 'Subcutánea', label: 'Subcutánea' },
    { value: 'Oftálmica', label: 'Oftálmica' },
    { value: 'Ótica', label: 'Ótica' },
    { value: 'Nasal', label: 'Nasal' },
    { value: 'Rectal', label: 'Rectal' }
  ];

  constructor(private fb: FormBuilder) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      administration: ['', Validators.required],
      duration: ['', Validators.required],
      observations: ['']
    });
  }

  ngOnInit() { }

  onOpenChange(open: boolean) {
    if (!open) {
      this.onCancel();
    }
  }

  onCancel() {
    this.medicineForm.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      const medicine: Medicine = this.medicineForm.value;
      this.add.emit(medicine);
      this.medicineForm.reset();
      this.close.emit();
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.medicineForm.controls).forEach(key => {
        this.medicineForm.get(key)?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.medicineForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}