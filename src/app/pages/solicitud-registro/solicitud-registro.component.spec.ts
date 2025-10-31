import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudRegistroComponent } from './solicitud-registro.component';

describe('SolicitudRegistroComponent', () => {
  let component: SolicitudRegistroComponent;
  let fixture: ComponentFixture<SolicitudRegistroComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SolicitudRegistroComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudRegistroComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with step 1', () => {
    expect(component.pasoActual).toBe(1);
  });

  it('should have all required forms initialized', () => {
    expect(component.paso1Form).toBeDefined();
    expect(component.paso2Form).toBeDefined();
    expect(component.paso3Form).toBeDefined();
    expect(component.paso4Form).toBeDefined();
    expect(component.paso5Form).toBeDefined();
  });

  it('should validate step 1 correctly', () => {
    // Initially invalid
    expect(component.isStep1Valid).toBeFalsy();

    // Set required values
    component.paso1Form.patchValue({
      perfilUsuario: 'medico',
      tipoMedicamentosControlados: 'ninguno'
    });

    expect(component.isStep1Valid).toBeTruthy();
  });

  it('should navigate to login when volverAlLogin is called', () => {
    component.volverAlLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should detect firma digital requirement correctly', () => {
    component.formData.tipoMedicamentosControlados = 'estupefacientes';
    expect(component.necesitaFirmaDigitalObligatoria()).toBeTruthy();

    component.formData.tipoMedicamentosControlados = 'psicotropicos';
    expect(component.necesitaFirmaDigitalObligatoria()).toBeTruthy();

    component.formData.tipoMedicamentosControlados = 'antimicrobianos';
    expect(component.necesitaFirmaDigitalObligatoria()).toBeFalsy();

    component.formData.tipoMedicamentosControlados = 'ninguno';
    expect(component.necesitaFirmaDigitalObligatoria()).toBeFalsy();
  });

  it('should advance to next step when validation passes', () => {
    // Set up valid step 1
    component.paso1Form.patchValue({
      perfilUsuario: 'medico',
      tipoMedicamentosControlados: 'ninguno'
    });

    const initialStep = component.pasoActual;
    component.siguientePaso();
    
    expect(component.pasoActual).toBe(initialStep + 1);
  });

  it('should not advance step when validation fails', () => {
    // Leave form invalid
    const initialStep = component.pasoActual;
    component.siguientePaso();
    
    expect(component.pasoActual).toBe(initialStep);
  });
});