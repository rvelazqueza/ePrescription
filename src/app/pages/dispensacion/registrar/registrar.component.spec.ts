import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RegistrarDispensacionComponent } from './registrar.component';

describe('RegistrarDispensacionComponent', () => {
  let component: RegistrarDispensacionComponent;
  let fixture: ComponentFixture<RegistrarDispensacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarDispensacionComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarDispensacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default prescription data', () => {
    expect(component.prescriptionData.prescriptionNumber).toBe('RX-2025-009847');
    expect(component.prescriptionData.patientName).toBe('María Elena González Rodríguez');
    expect(component.prescriptionData.status).toBe('draft');
  });

  it('should initialize with default medicines', () => {
    expect(component.medicines.length).toBe(3);
    expect(component.medicines[0].name).toBe('Ibuprofeno');
    expect(component.medicines[1].name).toBe('Amoxicilina');
    expect(component.medicines[2].name).toBe('Omeprazol');
  });

  it('should generate correct patient initials', () => {
    const initials = component.getPatientInitials();
    expect(initials).toBe('MG');
  });

  it('should open add medicine modal', () => {
    component.openAddMedicineModal();
    expect(component.showMedicineModal).toBe(true);
    expect(component.isEditMode).toBe(false);
    expect(component.currentMedicine.name).toBe('');
  });

  it('should open edit medicine modal', () => {
    const medicine = component.medicines[0];
    component.openEditMedicineModal(medicine);
    expect(component.showMedicineModal).toBe(true);
    expect(component.isEditMode).toBe(true);
    expect(component.currentMedicine.name).toBe('Ibuprofeno');
  });

  it('should close medicine modal', () => {
    component.showMedicineModal = true;
    component.closeMedicineModal();
    expect(component.showMedicineModal).toBe(false);
  });

  it('should add new medicine', () => {
    const initialCount = component.medicines.length;
    component.currentMedicine = {
      id: '',
      name: 'Paracetamol',
      quantity: '10 tabletas',
      dose: '500 mg',
      frequency: '3 veces al día',
      administration: 'Oral',
      duration: '3 días',
      observations: ''
    };
    component.isEditMode = false;
    component.saveMedicine();
    
    expect(component.medicines.length).toBe(initialCount + 1);
    expect(component.medicines[component.medicines.length - 1].name).toBe('Paracetamol');
  });

  it('should edit existing medicine', () => {
    const medicine = component.medicines[0];
    component.currentMedicine = { ...medicine, dose: '600 mg' };
    component.isEditMode = true;
    component.saveMedicine();
    
    expect(component.medicines[0].dose).toBe('600 mg');
  });

  it('should delete medicine', () => {
    const initialCount = component.medicines.length;
    const medicineToDelete = component.medicines[0];
    component.currentMedicine = medicineToDelete;
    component.isEditMode = true;
    component.deleteMedicine();
    
    expect(component.medicines.length).toBe(initialCount - 1);
    expect(component.medicines.find(m => m.id === medicineToDelete.id)).toBeUndefined();
  });

  it('should track medicine by id', () => {
    const medicine = component.medicines[0];
    const trackResult = component.trackByMedicineId(0, medicine);
    expect(trackResult).toBe(medicine.id);
  });

  it('should complete dispensation when medicines exist', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.completeDispensation();
    expect(component.prescriptionData.status).toBe('completed');
  });

  it('should not complete dispensation when no medicines', () => {
    component.medicines = [];
    spyOn(window, 'confirm');
    component.completeDispensation();
    expect(window.confirm).not.toHaveBeenCalled();
  });
});