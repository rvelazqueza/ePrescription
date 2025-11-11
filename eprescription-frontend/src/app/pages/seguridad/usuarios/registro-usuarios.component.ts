import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import * as L from 'leaflet';

interface Provincia {
  id: string;
  nombre: string;
}

interface Canton {
  id: string;
  provinciaId: string;
  nombre: string;
}

interface Distrito {
  id: string;
  cantonId: string;
  nombre: string;
}

const PERFILES_USUARIO = [
  { value: "medico", label: "Médico", colegio: "Colegio de Médicos y Cirujanos de Costa Rica", requiereColegio: true },
  { value: "farmaceutico", label: "Farmacéutico / Regente Farmacéutico", colegio: "Colegio de Farmacéuticos de Costa Rica", requiereColegio: true },
  { value: "odontologo", label: "Odontólogo", colegio: "Colegio de Cirujanos Dentistas de Costa Rica", requiereColegio: true },
  { value: "enfermero", label: "Enfermero / Obstetra", colegio: "Colegio de Enfermeros de Costa Rica", requiereColegio: true },
  { value: "veterinario", label: "Médico Veterinario", colegio: "Colegio de Médicos Veterinarios de Costa Rica", requiereColegio: true },
  { value: "farmacia", label: "Farmacia", colegio: "N/A", requiereColegio: false },
  { value: "centro_medico", label: "Centro Médico", colegio: "N/A", requiereColegio: false },
  { value: "drogueria", label: "Droguería", colegio: "N/A", requiereColegio: false },
  { value: "laboratorio", label: "Laboratorio", colegio: "N/A", requiereColegio: false },
  { value: "funcionario", label: "Funcionario de Salud", colegio: "N/A", requiereColegio: false }
];

type TipoControlado = "estupefacientes" | "psicotropicos" | "antimicrobianos" | "ninguno";
type MetodoAutenticacion = "firma_digital" | "password_mfa" | "";

interface RegistroFormData {
  perfilUsuario: string;
  tipoMedicamentosControlados: TipoControlado;
  metodoAutenticacion: MetodoAutenticacion;
  codigoProfesional: string;
  nombreCompleto: string;
  cedula: string;
  estadoProfesional: "activo" | "inactivo" | "";
  telefono: string;
  correoElectronico: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  otrasSenas: string;
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-registro-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, PageLayoutComponent],
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css']
})
export class RegistroUsuariosComponent implements OnInit, AfterViewInit {
  userPlusIcon = UserPlus;
  
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;
  private marker!: L.Marker;
  private tileLayer!: L.TileLayer;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Usuarios', route: '/seguridad/usuarios' },
    { label: 'Registro de usuarios' }
  ];

  readonly PERFILES_USUARIO = PERFILES_USUARIO;

  pasoActual = 1;
  validandoProfesional = false;
  profesionalValidado = false;
  procesandoRegistro = false;
  showSuccessDialog = false;
  geocodingLoading = false;
  
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'success';

  cantones: Canton[] = [];
  distritos: Distrito[] = [];
  
  get provincias(): Provincia[] {
    return this.provinciasCostaRica;
  }
  
  get cantonesFiltrados(): Canton[] {
    if (!this.formData.provinciaId) return [];
    return this.cantonesData.filter((c: Canton) => c.provinciaId === this.formData.provinciaId);
  }
  
  get distritosFiltrados(): Distrito[] {
    if (!this.formData.cantonId) return [];
    return this.distritosData.filter((d: Distrito) => d.cantonId === this.formData.cantonId);
  }

  formData: RegistroFormData = {
    perfilUsuario: "",
    tipoMedicamentosControlados: "ninguno",
    metodoAutenticacion: "",
    codigoProfesional: "",
    nombreCompleto: "",
    cedula: "",
    estadoProfesional: "",
    telefono: "",
    correoElectronico: "",
    provinciaId: "",
    cantonId: "",
    distritoId: "",
    otrasSenas: "",
    latitud: 9.9281,
    longitud: -84.0907
  };

  provinciasCostaRica: Provincia[] = [
    { id: "1", nombre: "San José" },
    { id: "2", nombre: "Alajuela" },
    { id: "3", nombre: "Cartago" },
    { id: "4", nombre: "Heredia" },
    { id: "5", nombre: "Guanacaste" },
    { id: "6", nombre: "Puntarenas" },
    { id: "7", nombre: "Limón" }
  ];

  cantonesData: Canton[] = [
    // San José
    { id: "101", provinciaId: "1", nombre: "San José" },
    { id: "102", provinciaId: "1", nombre: "Escazú" },
    { id: "103", provinciaId: "1", nombre: "Desamparados" },
    { id: "104", provinciaId: "1", nombre: "Puriscal" },
    { id: "105", provinciaId: "1", nombre: "Aserrí" },
    { id: "106", provinciaId: "1", nombre: "Mora" },
    { id: "107", provinciaId: "1", nombre: "Goicoechea" },
    { id: "108", provinciaId: "1", nombre: "Santa Ana" },
    { id: "109", provinciaId: "1", nombre: "Alajuelita" },
    { id: "110", provinciaId: "1", nombre: "Vázquez de Coronado" },
    { id: "111", provinciaId: "1", nombre: "Tibás" },
    { id: "112", provinciaId: "1", nombre: "Moravia" },
    { id: "113", provinciaId: "1", nombre: "Montes de Oca" },
    { id: "114", provinciaId: "1", nombre: "Curridabat" },
    
    // Alajuela
    { id: "201", provinciaId: "2", nombre: "Alajuela" },
    { id: "202", provinciaId: "2", nombre: "San Ramón" },
    { id: "203", provinciaId: "2", nombre: "Grecia" },
    { id: "204", provinciaId: "2", nombre: "San Mateo" },
    { id: "205", provinciaId: "2", nombre: "Atenas" },
    { id: "206", provinciaId: "2", nombre: "Naranjo" },
    { id: "207", provinciaId: "2", nombre: "Palmares" },
    { id: "208", provinciaId: "2", nombre: "Poás" },
    
    // Cartago
    { id: "301", provinciaId: "3", nombre: "Cartago" },
    { id: "302", provinciaId: "3", nombre: "Paraíso" },
    { id: "303", provinciaId: "3", nombre: "La Unión" },
    { id: "304", provinciaId: "3", nombre: "Jiménez" },
    { id: "305", provinciaId: "3", nombre: "Turrialba" },
    { id: "306", provinciaId: "3", nombre: "Alvarado" },
    { id: "307", provinciaId: "3", nombre: "Oreamuno" },
    { id: "308", provinciaId: "3", nombre: "El Guarco" },
    
    // Heredia
    { id: "401", provinciaId: "4", nombre: "Heredia" },
    { id: "402", provinciaId: "4", nombre: "Barva" },
    { id: "403", provinciaId: "4", nombre: "Santo Domingo" },
    { id: "404", provinciaId: "4", nombre: "Santa Bárbara" },
    { id: "405", provinciaId: "4", nombre: "San Rafael" },
    { id: "406", provinciaId: "4", nombre: "San Isidro" },
    { id: "407", provinciaId: "4", nombre: "Belén" },
    { id: "408", provinciaId: "4", nombre: "Flores" },
    { id: "409", provinciaId: "4", nombre: "San Pablo" },
    { id: "410", provinciaId: "4", nombre: "Sarapiquí" },
    
    // Guanacaste
    { id: "501", provinciaId: "5", nombre: "Liberia" },
    { id: "502", provinciaId: "5", nombre: "Nicoya" },
    { id: "503", provinciaId: "5", nombre: "Santa Cruz" },
    { id: "504", provinciaId: "5", nombre: "Bagaces" },
    { id: "505", provinciaId: "5", nombre: "Carrillo" },
    { id: "506", provinciaId: "5", nombre: "Cañas" },
    { id: "507", provinciaId: "5", nombre: "Abangares" },
    { id: "508", provinciaId: "5", nombre: "Tilarán" },
    { id: "509", provinciaId: "5", nombre: "Nandayure" },
    { id: "510", provinciaId: "5", nombre: "La Cruz" },
    { id: "511", provinciaId: "5", nombre: "Hojancha" },
    
    // Puntarenas
    { id: "601", provinciaId: "6", nombre: "Puntarenas" },
    { id: "602", provinciaId: "6", nombre: "Esparza" },
    { id: "603", provinciaId: "6", nombre: "Buenos Aires" },
    { id: "604", provinciaId: "6", nombre: "Montes de Oro" },
    { id: "605", provinciaId: "6", nombre: "Osa" },
    { id: "606", provinciaId: "6", nombre: "Quepos" },
    { id: "607", provinciaId: "6", nombre: "Golfito" },
    { id: "608", provinciaId: "6", nombre: "Coto Brus" },
    { id: "609", provinciaId: "6", nombre: "Parrita" },
    { id: "610", provinciaId: "6", nombre: "Corredores" },
    { id: "611", provinciaId: "6", nombre: "Garabito" },
    
    // Limón
    { id: "701", provinciaId: "7", nombre: "Limón" },
    { id: "702", provinciaId: "7", nombre: "Pococí" },
    { id: "703", provinciaId: "7", nombre: "Siquirres" },
    { id: "704", provinciaId: "7", nombre: "Talamanca" },
    { id: "705", provinciaId: "7", nombre: "Matina" },
    { id: "706", provinciaId: "7", nombre: "Guácimo" }
  ];

  distritosData: Distrito[] = [
    // San José - Cantón San José
    { id: "10101", cantonId: "101", nombre: "Carmen" },
    { id: "10102", cantonId: "101", nombre: "Merced" },
    { id: "10103", cantonId: "101", nombre: "Hospital" },
    { id: "10104", cantonId: "101", nombre: "Catedral" },
    { id: "10105", cantonId: "101", nombre: "Zapote" },
    
    // San José - Escazú
    { id: "10201", cantonId: "102", nombre: "Escazú" },
    { id: "10202", cantonId: "102", nombre: "San Antonio" },
    { id: "10203", cantonId: "102", nombre: "San Rafael" },
    
    // San José - Desamparados
    { id: "10301", cantonId: "103", nombre: "Desamparados" },
    { id: "10302", cantonId: "103", nombre: "San Miguel" },
    { id: "10303", cantonId: "103", nombre: "San Juan de Dios" },
    
    // Alajuela - Cantón Alajuela
    { id: "20101", cantonId: "201", nombre: "Alajuela" },
    { id: "20102", cantonId: "201", nombre: "San José" },
    { id: "20103", cantonId: "201", nombre: "Carrizal" },
    
    // Alajuela - San Ramón
    { id: "20201", cantonId: "202", nombre: "San Ramón" },
    { id: "20202", cantonId: "202", nombre: "Santiago" },
    { id: "20203", cantonId: "202", nombre: "San Juan" },
    
    // Cartago
    { id: "30101", cantonId: "301", nombre: "Oriental" },
    { id: "30102", cantonId: "301", nombre: "Occidental" },
    { id: "30103", cantonId: "301", nombre: "Carmen" },
    
    // Heredia
    { id: "40101", cantonId: "401", nombre: "Heredia" },
    { id: "40102", cantonId: "401", nombre: "Mercedes" },
    { id: "40103", cantonId: "401", nombre: "San Francisco" },
    
    // Guanacaste - Liberia
    { id: "50101", cantonId: "501", nombre: "Liberia" },
    { id: "50102", cantonId: "501", nombre: "Cañas Dulces" },
    { id: "50103", cantonId: "501", nombre: "Mayorga" },
    
    // Puntarenas
    { id: "60101", cantonId: "601", nombre: "Puntarenas" },
    { id: "60102", cantonId: "601", nombre: "Pitahaya" },
    { id: "60103", cantonId: "601", nombre: "Chomes" },
    
    // Limón
    { id: "70101", cantonId: "701", nombre: "Limón" },
    { id: "70102", cantonId: "701", nombre: "Valle La Estrella" },
    { id: "70103", cantonId: "701", nombre: "Río Blanco" }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.onTipoMedicamentosChange();
  }

  ngAfterViewInit() {
    // Leaflet se inicializa cuando se llega al paso 3
  }

  necesitaFirmaDigitalObligatoria(): boolean {
    return this.formData.tipoMedicamentosControlados === "estupefacientes" || 
           this.formData.tipoMedicamentosControlados === "psicotropicos";
  }

  onTipoMedicamentosChange() {
    if (this.necesitaFirmaDigitalObligatoria()) {
      this.formData.metodoAutenticacion = "firma_digital";
    }
  }

  onProvinciaChange() {
    this.formData.cantonId = "";
    this.formData.distritoId = "";
  }

  onCantonChange() {
    this.formData.distritoId = "";
  }

  async validarCodigoProfesional() {
    if (!this.formData.codigoProfesional) {
      this.showNotificationMessage("Ingrese el código profesional", "error");
      return;
    }

    this.validandoProfesional = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.formData.nombreCompleto = "Dr. Juan Carlos Pérez González";
      this.formData.cedula = "1-0234-0567";
      this.formData.estadoProfesional = "activo";
      this.profesionalValidado = true;
      
      this.showNotificationMessage("✅ Código profesional validado correctamente", "success");
    } catch (err) {
      this.showNotificationMessage("❌ Error al validar código profesional", "error");
    } finally {
      this.validandoProfesional = false;
    }
  }

  validarPaso(paso: number): boolean {
    switch (paso) {
      case 1:
        if (!this.formData.perfilUsuario) return false;
        if (this.formData.tipoMedicamentosControlados !== "ninguno" && !this.formData.metodoAutenticacion) return false;
        if (this.necesitaFirmaDigitalObligatoria() && this.formData.metodoAutenticacion !== "firma_digital") return false;
        return true;
      
      case 2:
        const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === this.formData.perfilUsuario);
        if (perfilSeleccionado?.requiereColegio) {
          return this.profesionalValidado && this.formData.estadoProfesional === "activo";
        }
        return true;
      
      case 3:
        if (!this.formData.telefono || !this.formData.correoElectronico) return false;
        if (!this.formData.provinciaId || !this.formData.cantonId || !this.formData.distritoId) return false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.correoElectronico)) return false;
        return true;
      
      default:
        return false;
    }
  }

  siguientePaso() {
    if (this.validarPaso(this.pasoActual)) {
      if (this.pasoActual < 4) {
        this.pasoActual++;
        
        if (this.pasoActual === 3) {
          setTimeout(() => this.initializeMap(), 100);
        }
      }
    } else {
      this.showNotificationMessage("Complete todos los campos requeridos", "error");
    }
  }

  pasoAnterior() {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  getTotalSteps(): number {
    return 4;
  }

  getPerfilSeleccionado() {
    return PERFILES_USUARIO.find(p => p.value === this.formData.perfilUsuario);
  }

  getColegioDelPerfil(): string {
    const perfil = this.getPerfilSeleccionado();
    return perfil ? perfil.colegio : '';
  }

  getStepBackgroundColor(paso: number): string {
    if (paso < this.pasoActual) return '#10b981';
    if (paso === this.pasoActual) return '#2563eb';
    return '#e5e7eb';
  }

  getStepTextColor(paso: number): string {
    return paso <= this.pasoActual ? 'white' : '#6b7280';
  }

  getStepLabelColor(paso: number): string {
    return paso === this.pasoActual ? '#111827' : '#6b7280';
  }

  getProgressLineColor(paso: number): string {
    return paso < this.pasoActual ? '#10b981' : '#e5e7eb';
  }

  isStep3Valid(): boolean {
    if (!this.formData.telefono || !this.formData.correoElectronico) return false;
    if (!this.formData.provinciaId || !this.formData.cantonId || !this.formData.distritoId) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.correoElectronico)) return false;
    return true;
  }

  getTipoMedicamentosLabel(): string {
    const tipos = {
      'ninguno': 'Solo medicamentos de libre venta',
      'antimicrobianos': 'Antimicrobianos (Antibióticos)',
      'psicotropicos': 'Psicotrópicos',
      'estupefacientes': 'Estupefacientes'
    };
    return tipos[this.formData.tipoMedicamentosControlados] || 'No especificado';
  }

  getMetodoAutenticacionLabel(): string {
    if (this.necesitaFirmaDigitalObligatoria()) {
      return 'Firma Digital BCCR (Obligatorio)';
    }
    const metodos: { [key: string]: string } = {
      'password_mfa': 'Usuario y Contraseña + MFA',
      'firma_digital': 'Firma Digital BCCR'
    };
    return metodos[this.formData.metodoAutenticacion] || 'No especificado';
  }

  getUbicacionCompleta(): string {
    const provincia = this.provincias.find(p => p.id === this.formData.provinciaId)?.nombre || '';
    const canton = this.cantonesFiltrados.find(c => c.id === this.formData.cantonId)?.nombre || '';
    const distrito = this.distritosFiltrados.find(d => d.id === this.formData.distritoId)?.nombre || '';
    
    return `${distrito}, ${canton}, ${provincia}`.replace(/^,\s*|,\s*$/g, '');
  }

  verificarGPS() {
    if (navigator.geolocation) {
      this.showNotificationMessage('✅ Su navegador soporta GPS. Puede usar el botón "Mi ubicación".', 'success');
    } else {
      this.showNotificationMessage('❌ Su navegador no soporta GPS. Use la selección manual.', 'error');
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      this.geocodingLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          this.updateLocation(lat, lng);
          this.showNotificationMessage('📍 Ubicación obtenida por GPS', 'success');
        },
        () => {
          this.showNotificationMessage('❌ No se pudo obtener la ubicación. Verifique los permisos del navegador.', 'error');
          this.geocodingLoading = false;
        }
      );
    } else {
      this.showNotificationMessage('❌ Geolocalización no soportada por este navegador', 'error');
    }
  }

  updateLocation(lat: number, lng: number) {
    this.formData.latitud = lat;
    this.formData.longitud = lng;
    
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
    
    this.reverseGeocode(lat, lng);
  }

  initializeMap() {
    if (!this.mapContainer) return;

    if (this.map) {
      this.map.remove();
      this.map = null as any;
    }

    console.log('Inicializando Leaflet con solución anti-tiles grises');

    const container = this.mapContainer.nativeElement;
    container.innerHTML = '';
    container.style.height = '400px';
    container.style.width = '100%';
    container.style.position = 'relative';
    container.style.display = 'block';

    setTimeout(() => {
      try {
        this.map = L.map(container, {
          center: [this.formData.latitud, this.formData.longitud],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
          touchZoom: true,
          fadeAnimation: false,
          zoomAnimation: false,
          markerZoomAnimation: false,
          preferCanvas: true
        });

        this.setupTileLayerWithFallback();
        this.setupCustomMarker();
        this.setupMapEvents();
        this.forceProperRendering();

        console.log('Leaflet inicializado con solución anti-tiles grises');

      } catch (error) {
        console.error('Error inicializando mapa:', error);
        this.showNotificationMessage('❌ Error al cargar el mapa', 'error');
      }
    }, 100);
  }

  private setupTileLayerWithFallback() {
    const tileProviders = [
      {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }
      },
      {
        name: 'CartoDB Positron',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        options: {
          attribution: '© OpenStreetMap © CartoDB',
          maxZoom: 19,
          subdomains: 'abcd'
        }
      },
      {
        name: 'OpenStreetMap France',
        url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        options: {
          attribution: '© OpenStreetMap France',
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }
      }
    ];

    let currentProviderIndex = 0;
    let tilesLoaded = 0;
    let tilesTotal = 0;
    let loadingTimeout: any;

    const tryNextProvider = () => {
      if (currentProviderIndex >= tileProviders.length) {
        console.error('Todos los proveedores de tiles fallaron');
        return;
      }

      const provider = tileProviders[currentProviderIndex];
      console.log(`Intentando proveedor de tiles: ${provider.name}`);

      if (this.tileLayer) {
        this.map.removeLayer(this.tileLayer);
      }

      this.tileLayer = L.tileLayer(provider.url, {
        ...provider.options,
        keepBuffer: 4,
        updateWhenZooming: false,
        updateWhenIdle: true,
        crossOrigin: true
      });

      tilesLoaded = 0;
      tilesTotal = 0;

      this.tileLayer.on('tileloadstart', () => {
        tilesTotal++;
        clearTimeout(loadingTimeout);
        loadingTimeout = setTimeout(() => {
          if (tilesLoaded < tilesTotal * 0.7) {
            console.log(`Proveedor ${provider.name} falló, intentando siguiente...`);
            currentProviderIndex++;
            tryNextProvider();
          }
        }, 5000);
      });

      this.tileLayer.on('tileload', () => {
        tilesLoaded++;
        if (tilesLoaded >= tilesTotal * 0.7) {
          clearTimeout(loadingTimeout);
          console.log(`Tiles cargados exitosamente con ${provider.name}`);
        }
      });

      this.tileLayer.on('tileerror', (e: any) => {
        console.log(`Error en tile de ${provider.name}:`, e);
      });

      this.tileLayer.addTo(this.map);
    };

    tryNextProvider();
  }

  private setupCustomMarker() {
    const customIcon = L.divIcon({
      html: `<div style="
        background: #dc2626; 
        width: 24px; 
        height: 24px; 
        border-radius: 50% 50% 50% 0; 
        border: 3px solid white; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white; 
          font-size: 12px; 
          transform: rotate(45deg);
          font-weight: bold;
        ">📍</div>
      </div>`,
      className: 'custom-leaflet-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });

    this.marker = L.marker([this.formData.latitud, this.formData.longitud], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);
  }

  private setupMapEvents() {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.marker.setLatLng([lat, lng]);
      this.updateLocation(lat, lng);
      this.showNotificationMessage('📍 Ubicación seleccionada', 'success');
    });

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateLocation(position.lat, position.lng);
      this.showNotificationMessage('📍 Marcador movido', 'success');
    });

    this.map.on('zoomend moveend', () => {
      console.log('Mapa actualizado - zoom:', this.map.getZoom(), 'centro:', this.map.getCenter());
    });
  }

  private forceProperRendering() {
    const forceRender = () => {
      if (this.map) {
        this.map.invalidateSize(true);
        
        if (this.tileLayer) {
          this.tileLayer.redraw();
        }
        
        console.log('Mapa redimensionado y tiles actualizados');
      }
    };

    setTimeout(forceRender, 100);
    setTimeout(forceRender, 300);
    setTimeout(forceRender, 600);
    setTimeout(forceRender, 1000);
    setTimeout(forceRender, 2000);
  }

  async reverseGeocode(lat: number, lng: number) {
    console.log('Iniciando geocodificación para:', lat, lng);
    this.geocodingLoading = true;
    
    setTimeout(() => {
      this.simulateGeocodeResult(lat, lng);
    }, 500);
  }

  simulateGeocodeResult(lat: number, lng: number) {
    console.log('Simulando geocodificación para coordenadas:', lat, lng);
    
    // Mapeo más realista basado en coordenadas geográficas de Costa Rica
    let provinciaId = "1";
    let cantonId = "101";
    let distritoId = "10101";
    let locationName = "San José Centro";
    
    // Definir ubicaciones específicas con coordenadas precisas
    const locations = [
      // San José
      { lat: 9.9281, lng: -84.0907, prov: "1", cant: "101", dist: "10101", name: "San José Centro" },
      { lat: 9.9195, lng: -84.1404, prov: "1", cant: "102", dist: "10201", name: "Escazú" },
      { lat: 9.8988, lng: -84.0658, prov: "1", cant: "103", dist: "10301", name: "Desamparados" },
      { lat: 9.9358, lng: -84.1059, prov: "1", cant: "107", dist: "10701", name: "Goicoechea" },
      { lat: 9.9195, lng: -84.1404, prov: "1", cant: "108", dist: "10801", name: "Santa Ana" },
      { lat: 9.9358, lng: -84.0658, prov: "1", cant: "111", dist: "11101", name: "Tibás" },
      { lat: 9.9195, lng: -84.0658, prov: "1", cant: "112", dist: "11201", name: "Moravia" },
      { lat: 9.9358, lng: -84.0507, prov: "1", cant: "113", dist: "11301", name: "Montes de Oca" },
      { lat: 9.9195, lng: -84.0507, prov: "1", cant: "114", dist: "11401", name: "Curridabat" },
      
      // Alajuela
      { lat: 10.0162, lng: -84.2119, prov: "2", cant: "201", dist: "20101", name: "Alajuela Centro" },
      { lat: 10.0908, lng: -84.4669, prov: "2", cant: "202", dist: "20201", name: "San Ramón" },
      { lat: 10.0708, lng: -84.3169, prov: "2", cant: "203", dist: "20301", name: "Grecia" },
      { lat: 9.9708, lng: -84.4319, prov: "2", cant: "205", dist: "20501", name: "Atenas" },
      { lat: 10.0508, lng: -84.3819, prov: "2", cant: "206", dist: "20601", name: "Naranjo" },
      
      // Cartago
      { lat: 9.8644, lng: -83.9194, prov: "3", cant: "301", dist: "30101", name: "Cartago Centro" },
      { lat: 9.8344, lng: -83.8694, prov: "3", cant: "302", dist: "30201", name: "Paraíso" },
      { lat: 9.8944, lng: -83.8194, prov: "3", cant: "305", dist: "30501", name: "Turrialba" },
      
      // Heredia
      { lat: 9.9981, lng: -84.1169, prov: "4", cant: "401", dist: "40101", name: "Heredia Centro" },
      { lat: 10.0181, lng: -84.1369, prov: "4", cant: "402", dist: "40201", name: "Barva" },
      { lat: 9.9781, lng: -84.0869, prov: "4", cant: "403", dist: "40301", name: "Santo Domingo" },
      { lat: 9.9581, lng: -84.1569, prov: "4", cant: "407", dist: "40701", name: "Belén" },
      
      // Guanacaste
      { lat: 10.6344, lng: -85.4419, prov: "5", cant: "501", dist: "50101", name: "Liberia" },
      { lat: 10.1481, lng: -85.4519, prov: "5", cant: "502", dist: "50201", name: "Nicoya" },
      { lat: 10.2681, lng: -85.6219, prov: "5", cant: "503", dist: "50301", name: "Santa Cruz" },
      { lat: 10.4381, lng: -85.0919, prov: "5", cant: "506", dist: "50601", name: "Cañas" },
      
      // Puntarenas
      { lat: 9.9769, lng: -84.8319, prov: "6", cant: "601", dist: "60101", name: "Puntarenas Centro" },
      { lat: 9.8469, lng: -84.6619, prov: "6", cant: "602", dist: "60201", name: "Esparza" },
      { lat: 9.1669, lng: -83.7519, prov: "6", cant: "603", dist: "60301", name: "Buenos Aires" },
      { lat: 9.3369, lng: -84.1619, prov: "6", cant: "606", dist: "60601", name: "Quepos" },
      
      // Limón
      { lat: 9.9981, lng: -83.0319, prov: "7", cant: "701", dist: "70101", name: "Limón Centro" },
      { lat: 10.1981, lng: -83.5619, prov: "7", cant: "702", dist: "70201", name: "Pococí" },
      { lat: 10.0981, lng: -83.5119, prov: "7", cant: "703", dist: "70301", name: "Siquirres" },
      { lat: 9.4481, lng: -82.8719, prov: "7", cant: "704", dist: "70401", name: "Talamanca" }
    ];
    
    // Buscar la ubicación más cercana
    let minDistance = Infinity;
    let closestLocation = locations[0];
    
    for (const location of locations) {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    }
    
    // Si está muy cerca (menos de 0.05 grados ≈ 5.5km), usar la ubicación exacta
    if (minDistance < 0.05) {
      provinciaId = closestLocation.prov;
      cantonId = closestLocation.cant;
      distritoId = closestLocation.dist;
      locationName = closestLocation.name;
    }
    // Si no, usar lógica de zonas geográficas
    else {
      // Zona Metropolitana (San José y alrededores)
      if (lat >= 9.80 && lat <= 10.10 && lng >= -84.30 && lng <= -83.80) {
        if (lng <= -84.10) {
          provinciaId = "1"; cantonId = "102"; distritoId = "10201"; locationName = "Zona Oeste GAM";
        } else if (lng <= -84.00) {
          provinciaId = "1"; cantonId = "101"; distritoId = "10101"; locationName = "Zona Centro GAM";
        } else {
          provinciaId = "3"; cantonId = "301"; distritoId = "30101"; locationName = "Zona Este GAM";
        }
      }
      // Zona Norte (Alajuela extendida)
      else if (lat >= 10.10 && lng >= -85.00 && lng <= -83.50) {
        provinciaId = "2"; cantonId = "201"; distritoId = "20101"; locationName = "Zona Norte";
      }
      // Zona Atlántica (Limón)
      else if (lng >= -83.50) {
        provinciaId = "7"; cantonId = "701"; distritoId = "70101"; locationName = "Zona Atlántica";
      }
      // Zona Pacífica Norte (Guanacaste)
      else if (lat >= 10.00 && lng <= -84.50) {
        provinciaId = "5"; cantonId = "501"; distritoId = "50101"; locationName = "Zona Pacífico Norte";
      }
      // Zona Pacífica Sur (Puntarenas)
      else if (lat < 10.00 && lng <= -84.50) {
        provinciaId = "6"; cantonId = "601"; distritoId = "60101"; locationName = "Zona Pacífico Sur";
      }
      // Por defecto: San José centro
      else {
        provinciaId = "1"; cantonId = "101"; distritoId = "10101"; locationName = "San José Centro";
      }
    }
    
    // Aplicar la selección
    this.formData.provinciaId = provinciaId;
    this.onProvinciaChange();
    this.formData.cantonId = cantonId;
    this.onCantonChange();
    this.formData.distritoId = distritoId;
    
    this.geocodingLoading = false;
    
    // Mensaje más específico según la ubicación
    const provincia = this.provincias.find(p => p.id === provinciaId)?.nombre || 'Costa Rica';
    const canton = this.cantonesData.find(c => c.id === cantonId)?.nombre || '';
    this.showNotificationMessage(`📍 Ubicación detectada: ${locationName}, ${canton}, ${provincia}`, 'success');
  }

  async completarRegistro() {
    this.procesandoRegistro = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.procesandoRegistro = false;
      this.showSuccessDialog = true;
      
      console.log('Usuario registrado:', this.formData);
      
    } catch (err) {
      this.showNotificationMessage('❌ Error al registrar usuario. Intente nuevamente.', 'error');
      this.procesandoRegistro = false;
    }
  }

  reiniciarFormulario() {
    this.formData = {
      perfilUsuario: "",
      tipoMedicamentosControlados: "ninguno",
      metodoAutenticacion: "",
      codigoProfesional: "",
      nombreCompleto: "",
      cedula: "",
      estadoProfesional: "",
      telefono: "",
      correoElectronico: "",
      provinciaId: "",
      cantonId: "",
      distritoId: "",
      otrasSenas: "",
      latitud: 9.9281,
      longitud: -84.0907
    };
    this.pasoActual = 1;
    this.profesionalValidado = false;
    this.showSuccessDialog = false;
  }

  cerrarModalExito() {
    this.showSuccessDialog = false;
    this.router.navigate(['/seguridad/usuarios']);
  }

  showNotificationMessage(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    setTimeout(() => {
      this.hideNotification();
    }, 4000);
  }

  hideNotification() {
    this.showNotification = false;
  }
}