import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Receipt, CreditCard, ShoppingCart, Search, Filter, Download, Plus, Package, CheckCircle2, DollarSign, Calendar, Info, Eye, X, User, ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';

interface TalonarioCompra {
  id: string;
  tipo: 'receta' | 'despacho';
  subTipo?: 'antimicrobiano' | 'estupefaciente' | 'psicotropico' | 'normal';
  cantidad: number;
  precio: number;
  descripcion: string;
  limite: number;
}

@Component({
  selector: 'app-comprar-talonarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Compra de Talonarios" 
        description="Gestión y adquisición de talonarios para recetas y despacho de medicamentos controlados"
        [icon]="receiptIcon"
        [actionButton]="true">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Disponibles para compra</p>
            <p class="text-2xl font-bold text-white">{{ tiposTalonarios.length }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Tipos Disponibles</p>
              <p class="text-3xl font-bold text-gray-900">{{ tiposTalonarios.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="packageIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Disponibles</p>
              <p class="text-3xl font-bold text-gray-900">206</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-purple-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Utilizados</p>
              <p class="text-3xl font-bold text-gray-900">164</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <lucide-icon [img]="receiptIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Compras este mes</p>
              <p class="text-3xl font-bold text-gray-900">3</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <lucide-icon [img]="shoppingCartIcon" class="w-8 h-8 text-yellow-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarTalonarios()"
              placeholder="Buscar tipo de talonario..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          
          <select 
            [(ngModel)]="filtroTipo"
            (change)="filtrarTalonarios()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="receta">Receta</option>
            <option value="despacho">Despacho</option>
          </select>
          
          <select 
            [(ngModel)]="filtroSubTipo"
            (change)="filtrarTalonarios()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los subtipos</option>
            <option value="normal">Normal</option>
            <option value="antimicrobiano">Antimicrobiano</option>
            <option value="estupefaciente">Estupefaciente</option>
            <option value="psicotropico">Psicotrópico</option>
          </select>

          <button 
            (click)="toggleMayusculas()"
            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            {{ showUppercase ? 'Normal' : 'MAYÚSCULAS' }}
          </button>
        </div>
      </div>

      <!-- Tabla de talonarios disponibles -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <lucide-icon [img]="shoppingCartIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Talonarios Disponibles</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ talonariosFiltrados.length }} tipo{{ talonariosFiltrados.length !== 1 ? 's' : '' }} disponible{{ talonariosFiltrados.length !== 1 ? 's' : '' }} para compra
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                (click)="abrirHistorialCompras()"
                class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                Historial de Compras
              </button>
              <button 
                (click)="abrirComprarTalonarios()"
                class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2">
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Comprar Talonarios
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="talonariosFiltrados.length === 0" class="text-center py-12">
          <lucide-icon [img]="packageIcon" class="w-16 h-16 text-gray-300 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay talonarios disponibles</h3>
          <p class="text-gray-600">No se encontraron talonarios con los filtros aplicados</p>
        </div>

        <div *ngIf="talonariosFiltrados.length > 0" class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Límite Máximo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let talonario of talonariosFiltrados" class="hover:bg-blue-50/50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="receiptIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <div>
                      <span [class]="getTipoBadgeClass(talonario.tipo, talonario.subTipo)" 
                            class="px-2 py-1 text-xs font-semibold rounded-full">
                        {{ transformText(getTipoTexto(talonario.tipo, talonario.subTipo)) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-gray-900">{{ transformText(talonario.descripcion) }}</p>
                    <p class="text-xs text-gray-500">{{ transformText('50 recetas por talonario') }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="dollarSignIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                    <span class="text-lg font-semibold text-green-600">₡{{ talonario.precio.toLocaleString() }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ talonario.limite }} talonarios</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    <lucide-icon [img]="checkCircle2Icon" class="w-3 h-3 mr-1"></lucide-icon>
                    {{ transformText('Disponible') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>



      <!-- Información sobre talonarios -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Información sobre compra de talonarios</h4>
            <p class="text-sm text-blue-700">
              Los talonarios son válidos por 12 meses desde la fecha de compra. Cada receta tiene un número único de identificación. 
              Los talonarios se entregan digitalmente en su cuenta. El sistema validará su código profesional antes de procesar la compra.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Historial de Compras -->
    <div 
      *ngIf="showHistorialDialog"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarHistorialDialog()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Historial de Compras
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Registro completo de todas sus compras de talonarios
                </p>
              </div>
              <button 
                (click)="cerrarHistorialDialog()"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-400"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Orden</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let compra of historialCompras" class="hover:bg-gray-50">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDateTime(compra.fecha) }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ compra.numeroOrden }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span [class]="getTipoBadgeClass(compra.tipo, compra.subTipo)" 
                            class="px-2 py-1 text-xs font-semibold rounded-full">
                        {{ transformText(getTipoTexto(compra.tipo, compra.subTipo)) }}
                      </span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ compra.cantidad }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₡{{ compra.total.toLocaleString() }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {{ transformText(compra.estado.toUpperCase()) }}
                      </span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        (click)="verFactura(compra)"
                        class="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                        Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-3 flex justify-end">
            <button 
              (click)="cerrarHistorialDialog()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Comprar Talonarios -->
    <div 
      *ngIf="showComprarDialog"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarComprarDialog()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Comprar Talonarios
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Complete la información para adquirir talonarios. El sistema validará su código profesional con el colegio correspondiente.
                </p>
              </div>
              <button 
                (click)="cerrarComprarDialog()"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-400"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4 space-y-6">
            <!-- Datos del profesional -->
            <div class="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                <h4 class="font-medium">Datos del Profesional</h4>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Colegio Profesional *</label>
                  <select 
                    [(ngModel)]="formData.colegioProfesional"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccione...</option>
                    <option value="medicos">Colegio de Médicos y Cirujanos</option>
                    <option value="farmaceuticos">Colegio de Farmacéuticos</option>
                    <option value="veterinarios">Colegio de Médicos Veterinarios</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Código Profesional *</label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="MED-12345"
                      [(ngModel)]="formData.codigoProfesional"
                      [disabled]="professionalValidated"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                    <button
                      (click)="validarCodigoProfesional()"
                      [disabled]="!formData.codigoProfesional || !formData.colegioProfesional || professionalValidated || validatingProfessional"
                      class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      <lucide-icon 
                        [img]="validatingProfessional ? loader2Icon : (professionalValidated ? checkCircleIcon : shieldCheckIcon)" 
                        class="w-4 h-4"
                        [class.animate-spin]="validatingProfessional">
                      </lucide-icon>
                    </button>
                  </div>
                </div>
              </div>

              <div *ngIf="professionalValidated" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  <span class="text-sm font-medium text-green-800">Código Validado</span>
                </div>
                <p class="text-sm text-green-700 mt-1">
                  <strong>{{ formData.nombreProfesional }}</strong><br>
                  Estado: <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{{ formData.estadoProfesional.toUpperCase() }}</span>
                </p>
              </div>

              <div *ngIf="professionalValidated && formData.estadoProfesional !== 'activo'" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="alertCircleIcon" class="w-4 h-4 text-red-600"></lucide-icon>
                  <span class="text-sm font-medium text-red-800">Código No Activo</span>
                </div>
                <p class="text-sm text-red-700 mt-1">
                  El código profesional no está en estado activo. No puede realizar compras de talonarios.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-3 flex justify-between">
            <button 
              (click)="cerrarComprarDialog()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              (click)="continuarAlPago()"
              [disabled]="!professionalValidated || formData.estadoProfesional !== 'activo'"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <lucide-icon [img]="creditCardIcon" class="w-4 h-4"></lucide-icon>
              Continuar al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ComprarTalonariosComponent {
  receiptIcon = Receipt;
  creditCardIcon = CreditCard;
  shoppingCartIcon = ShoppingCart;
  searchIcon = Search;
  filterIcon = Filter;
  downloadIcon = Download;
  plusIcon = Plus;
  packageIcon = Package;
  checkCircle2Icon = CheckCircle2;
  dollarSignIcon = DollarSign;
  calendarIcon = Calendar;
  infoIcon = Info;
  eyeIcon = Eye;
  xIcon = X;
  userIcon = User;
  shieldCheckIcon = ShieldCheck;
  loader2Icon = Loader2;
  checkCircleIcon = CheckCircle;
  alertCircleIcon = AlertCircle;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Talonarios', route: '/talonarios' },
    { label: 'Comprar Talonarios' }
  ];

  terminoBusqueda = '';
  filtroTipo = '';
  filtroSubTipo = '';
  showUppercase = false;
  
  // Modales
  showHistorialDialog = false;
  showComprarDialog = false;
  
  // Validación profesional
  validatingProfessional = false;
  professionalValidated = false;
  
  // Formulario
  formData = {
    colegioProfesional: '',
    codigoProfesional: '',
    nombreProfesional: '',
    estadoProfesional: '' as 'activo' | 'inactivo' | 'suspendido' | ''
  };

  tiposTalonarios: TalonarioCompra[] = [
    {
      id: 'receta-normal',
      tipo: 'receta',
      subTipo: 'normal',
      cantidad: 1,
      precio: 1500,
      descripcion: 'Talonario de Recetas Normales',
      limite: 10
    },
    {
      id: 'receta-antimicrobiano',
      tipo: 'receta',
      subTipo: 'antimicrobiano',
      cantidad: 1,
      precio: 2500,
      descripcion: 'Talonario de Recetas Antimicrobianas',
      limite: 5
    },
    {
      id: 'receta-estupefaciente',
      tipo: 'receta',
      subTipo: 'estupefaciente',
      cantidad: 1,
      precio: 3500,
      descripcion: 'Talonario de Recetas Estupefacientes',
      limite: 3
    },
    {
      id: 'receta-psicotropico',
      tipo: 'receta',
      subTipo: 'psicotropico',
      cantidad: 1,
      precio: 3000,
      descripcion: 'Talonario de Recetas Psicotrópicas',
      limite: 4
    },
    {
      id: 'despacho-normal',
      tipo: 'despacho',
      cantidad: 1,
      precio: 1000,
      descripcion: 'Talonario de Despacho de Farmacia',
      limite: 15
    }
  ];

  talonariosFiltrados: TalonarioCompra[] = [...this.tiposTalonarios];
  
  historialCompras = [
    {
      id: 'COMP-001',
      fecha: '2024-10-05T14:30:00',
      numeroOrden: 'ORD-2024-1523',
      tipo: 'receta' as 'receta' | 'despacho',
      subTipo: 'antimicrobiano' as 'antimicrobiano' | 'estupefaciente' | 'psicotropico' | 'normal',
      cantidad: 2,
      precioUnitario: 2500,
      total: 5000,
      estado: 'completado',
      metodoPago: 'Tarjeta de crédito VISA ****1234',
      numeroFactura: 'FACT-2024-1523'
    },
    {
      id: 'COMP-002',
      fecha: '2024-10-04T10:15:00',
      numeroOrden: 'ORD-2024-1498',
      tipo: 'receta' as 'receta' | 'despacho',
      subTipo: 'normal' as 'antimicrobiano' | 'estupefaciente' | 'psicotropico' | 'normal',
      cantidad: 5,
      precioUnitario: 1500,
      total: 7500,
      estado: 'completado',
      metodoPago: 'Transferencia SINPE Móvil',
      numeroFactura: 'FACT-2024-1498'
    },
    {
      id: 'COMP-003',
      fecha: '2024-10-03T16:45:00',
      numeroOrden: 'ORD-2024-1475',
      tipo: 'despacho' as 'receta' | 'despacho',
      cantidad: 10,
      precioUnitario: 1000,
      total: 10000,
      estado: 'completado',
      metodoPago: 'Tarjeta de débito BAC ****5678',
      numeroFactura: 'FACT-2024-1475'
    }
  ];



  filtrarTalonarios() {
    this.talonariosFiltrados = this.tiposTalonarios.filter(talonario => {
      const matchesSearch = !this.terminoBusqueda || 
        talonario.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        (talonario.subTipo && talonario.subTipo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()));
      
      const matchesTipo = !this.filtroTipo || talonario.tipo === this.filtroTipo;
      const matchesSubTipo = !this.filtroSubTipo || talonario.subTipo === this.filtroSubTipo;

      return matchesSearch && matchesTipo && matchesSubTipo;
    });
  }

  toggleMayusculas() {
    this.showUppercase = !this.showUppercase;
  }

  transformText(text: string): string {
    return this.showUppercase ? text.toUpperCase() : text;
  }

  getTipoBadgeClass(tipo: string, subTipo?: string): string {
    if (tipo === 'receta') {
      const colors = {
        'antimicrobiano': 'bg-blue-100 text-blue-800',
        'estupefaciente': 'bg-purple-100 text-purple-800',
        'psicotropico': 'bg-pink-100 text-pink-800',
        'normal': 'bg-gray-100 text-gray-800'
      };
      return colors[subTipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    }
    return 'bg-teal-100 text-teal-800';
  }

  getTipoTexto(tipo: string, subTipo?: string): string {
    if (tipo === 'receta') {
      return subTipo ? subTipo.toUpperCase() : 'RECETA';
    }
    return 'DESPACHO';
  }


  
  // Métodos para modales
  abrirHistorialCompras() {
    this.showHistorialDialog = true;
  }
  
  cerrarHistorialDialog() {
    this.showHistorialDialog = false;
  }
  
  abrirComprarTalonarios() {
    this.showComprarDialog = true;
  }
  
  cerrarComprarDialog() {
    this.showComprarDialog = false;
    this.resetFormulario();
  }
  
  // Validación profesional
  validarCodigoProfesional() {
    this.validatingProfessional = true;
    
    // Simulación de llamada a API
    setTimeout(() => {
      this.formData.nombreProfesional = 'Dr. Juan Pérez González';
      this.formData.estadoProfesional = 'activo';
      this.professionalValidated = true;
      this.validatingProfessional = false;
    }, 1500);
  }
  
  continuarAlPago() {
    console.log('Continuar al pago...');
    this.cerrarComprarDialog();
  }
  
  resetFormulario() {
    this.formData = {
      colegioProfesional: '',
      codigoProfesional: '',
      nombreProfesional: '',
      estadoProfesional: ''
    };
    this.professionalValidated = false;
    this.validatingProfessional = false;
  }
  
  // Utilidades
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
  
  verFactura(compra: any) {
    console.log('Ver factura:', compra);
  }
}