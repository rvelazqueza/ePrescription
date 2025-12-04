# Implementation Plan

## Task 1: Actualizar componentes de farmacias

- [ ] 1.1 Actualizar `pages/farmacias/farmacias.component.ts`
  - Cambiar import de `PharmacyMockService` a `PharmacyService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 1.2 Actualizar `pages/farmacias/lista/lista.component.ts`
  - Cambiar import de `PharmacyMockService` a `PharmacyService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 1.3 Actualizar `pages/inventario/farmacias/farmacias.component.ts`
  - Cambiar import de `PharmacyMockService` a `PharmacyService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

## Task 2: Actualizar componentes de inventario

- [ ] 2.1 Actualizar `pages/inventario/ajustes/ajustes.component.ts`
  - Cambiar import de `InventoryMockService` a `InventoryService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (adjustments, error)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 2.2 Actualizar `pages/inventario/alertas/alertas.component.ts`
  - Cambiar import de `InventoryMockService` a `InventoryService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (alerts, error)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 2.3 Actualizar `pages/inventario/consulta/consulta.component.ts`
  - Cambiar import de `InventoryQueryMockService` a `InventoryService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (data)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 2.4 Actualizar `pages/inventario/lotes/lotes.component.ts`
  - Cambiar import de `InventoryMockService` a `InventoryService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (lotes)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 2.5 Actualizar `pages/inventario/stock/stock.component.ts`
  - Cambiar import de `InventoryMockService` a `InventoryService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (items)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

## Task 3: Actualizar componentes de médicos

- [ ] 3.1 Actualizar `pages/medicos/editar/editar.component.ts`
  - Cambiar import de `DoctorMockService` a `DoctorService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (doctors, error, success)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 3.2 Actualizar `pages/medicos/lista/lista.component.ts`
  - Cambiar import de `DoctorMockService` a `DoctorService`
  - Actualizar constructor
  - Agregar tipos explícitos a callbacks (doctors, error, success)
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

## Task 4: Verificar compilación y funcionalidad

- [ ] 4.1 Compilar aplicación Angular
  - Ejecutar `ng build` o verificar que `npm start` compila sin errores
  - Verificar que no hay errores de módulos no encontrados
  - Verificar que no hay warnings de tipos implícitos
  - _Requirements: 1.1, 2.3_

- [ ] 4.2 Probar funcionalidad básica
  - Verificar que la vista de farmacias carga datos
  - Verificar que las vistas de inventario funcionan
  - Verificar que las vistas de médicos funcionan
  - Confirmar que no hay errores 400 en consola
  - _Requirements: 1.2, 4.1, 4.2_
