# Task 13 - Próximos Pasos (Inventory Management)

## Estado Actual
✅ **Task 13.1-13.6 COMPLETADO Y PUSHEADO**
- Commit: `5bf7510`
- Branch: `feature/task-13-dispensation-inventory-api`
- Tests: 8/8 PASSED (100%)

## Tareas Pendientes: Task 13.7-13.14

### 📋 Task 13.7: DTOs, Validadores y Mappers para Inventario
**Objetivo:** Crear la estructura de datos para gestión de inventario

**Archivos a crear:**
```
eprescription-API/src/ePrescription.Application/
├── DTOs/InventoryDtos.cs
│   ├── CreateInventoryDto
│   ├── UpdateInventoryDto
│   ├── InventoryDto
│   ├── InventoryListDto
│   ├── AddStockDto
│   ├── AdjustStockDto
│   └── LowStockAlertDto
├── Validators/InventoryValidators.cs
│   ├── CreateInventoryDtoValidator
│   ├── UpdateInventoryDtoValidator
│   ├── AddStockDtoValidator
│   └── AdjustStockDtoValidator
└── Mappings/InventoryMappingProfile.cs
```

**Campos importantes:**
- MedicationId (FK)
- PharmacyId (FK)
- BatchNumber
- ExpirationDate
- Quantity
- MinimumStock (para alertas)
- Location (ubicación en farmacia)

---

### 📋 Task 13.8: Commands para Gestión de Inventario
**Objetivo:** Implementar operaciones de inventario

**Commands a crear:**
```
eprescription-API/src/ePrescription.Application/Commands/Inventory/
├── AddStockCommand.cs
├── AddStockCommandHandler.cs
├── AdjustStockCommand.cs
├── AdjustStockCommandHandler.cs
├── UpdateInventoryCommand.cs
└── UpdateInventoryCommandHandler.cs
```

**Queries a crear:**
```
eprescription-API/src/ePrescription.Application/Queries/Inventory/
├── GetInventoryQuery.cs
├── GetInventoryQueryHandler.cs
├── SearchInventoryQuery.cs
├── SearchInventoryQueryHandler.cs
├── GetLowStockAlertsQuery.cs
└── GetLowStockAlertsQueryHandler.cs
```

**Operaciones:**
1. **AddStock**: Agregar nuevo lote de medicamento
2. **AdjustStock**: Ajustar cantidad (correcciones, pérdidas)
3. **GetInventory**: Obtener inventario por farmacia/medicamento
4. **SearchInventory**: Buscar con filtros

---

### 📋 Task 13.9: InventoryController
**Objetivo:** Crear endpoints REST para inventario

**Endpoints a implementar:**
```csharp
[ApiController]
[Route("api/inventory")]
public class InventoryController : ControllerBase
{
    // GET /api/inventory?pharmacyId={id}&medicationId={id}
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<InventoryListDto>>> SearchInventory(
        [FromQuery] SearchInventoryQuery query)
    
    // GET /api/inventory/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryDto>> GetInventory(Guid id)
    
    // POST /api/inventory/add-stock
    [HttpPost("add-stock")]
    public async Task<ActionResult<InventoryDto>> AddStock(
        [FromBody] AddStockDto dto)
    
    // POST /api/inventory/adjust-stock
    [HttpPost("adjust-stock")]
    public async Task<ActionResult<InventoryDto>> AdjustStock(
        [FromBody] AdjustStockDto dto)
    
    // GET /api/inventory/low-stock
    [HttpGet("low-stock")]
    public async Task<ActionResult<List<LowStockAlertDto>>> GetLowStockAlerts(
        [FromQuery] Guid? pharmacyId)
    
    // GET /api/inventory/expiring-soon
    [HttpGet("expiring-soon")]
    public async Task<ActionResult<List<InventoryDto>>> GetExpiringSoon(
        [FromQuery] Guid? pharmacyId, 
        [FromQuery] int days = 30)
}
```

---

### 📋 Task 13.10: Alertas de Stock Bajo
**Objetivo:** Implementar sistema de alertas

**Lógica:**
```csharp
// Query para obtener items con stock bajo
public class GetLowStockAlertsQuery : IRequest<List<LowStockAlertDto>>
{
    public Guid? PharmacyId { get; set; }
}

// Handler
public class GetLowStockAlertsQueryHandler
{
    public async Task<List<LowStockAlertDto>> Handle(...)
    {
        // Buscar items donde Quantity <= MinimumStock
        var lowStockItems = await _context.Inventory
            .Where(i => i.Quantity <= i.MinimumStock)
            .Where(i => !pharmacyId.HasValue || i.PharmacyId == pharmacyId)
            .Include(i => i.Medication)
            .Include(i => i.Pharmacy)
            .ToListAsync();
        
        return _mapper.Map<List<LowStockAlertDto>>(lowStockItems);
    }
}
```

---

### 📋 Task 13.11: Validación de Lotes y Vencimientos
**Objetivo:** Asegurar calidad de datos de inventario

**Validaciones a implementar:**

```csharp
public class AddStockDtoValidator : AbstractValidator<AddStockDto>
{
    public AddStockDtoValidator()
    {
        RuleFor(x => x.BatchNumber)
            .NotEmpty()
            .MaximumLength(50);
        
        RuleFor(x => x.ExpirationDate)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Expiration date must be in the future");
        
        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity must be greater than zero");
        
        RuleFor(x => x.MedicationId)
            .NotEmpty();
        
        RuleFor(x => x.PharmacyId)
            .NotEmpty();
    }
}
```

**Validaciones en Handler:**
- Verificar que medicamento existe
- Verificar que farmacia existe
- Verificar que lote no esté duplicado
- Alertar si fecha de vencimiento es cercana

---

### 📋 Task 13.12: Pruebas con Postman
**Objetivo:** Verificar todos los endpoints de inventario

**Colección a crear:** `Task-13-Inventory-API-Tests.postman_collection.json`

**Tests a incluir:**
1. Add Stock - Success
2. Add Stock - Invalid data
3. Add Stock - Expired medication
4. Adjust Stock - Increase
5. Adjust Stock - Decrease
6. Get Inventory by ID
7. Search Inventory by Pharmacy
8. Search Inventory by Medication
9. Get Low Stock Alerts
10. Get Expiring Soon

---

### 📋 Task 13.13: Tests de Integración
**Objetivo:** Crear tests automatizados

**Script a crear:** `test-task13-inventory-complete.ps1`

**Tests a incluir:**
```powershell
# Setup
- Create test pharmacy
- Create test medication

# Inventory Tests
- Add stock successfully
- Verify stock was added
- Adjust stock (increase)
- Adjust stock (decrease)
- Get inventory by pharmacy
- Get low stock alerts
- Get expiring soon

# Validation Tests
- Add stock with expired date (400)
- Add stock with negative quantity (400)
- Adjust stock with invalid ID (404)

# Cleanup
- Delete test data
```

---

### 📋 Task 13.14: Commit y Push Final
**Objetivo:** Completar Task 13

**Checklist antes de push:**
- [ ] Todos los endpoints implementados
- [ ] Validaciones funcionando
- [ ] Tests automatizados pasando
- [ ] Documentación actualizada
- [ ] Código compilando sin errores
- [ ] Docker funcionando correctamente

**Comando de commit:**
```bash
git commit -m "feat: Implement Inventory Management API (Task 13.7-13.14)

- Add Inventory DTOs with validation
- Implement AddStock and AdjustStock commands
- Add inventory queries with filters
- Create InventoryController with all endpoints
- Implement low stock alerts system
- Add batch and expiration date validation
- Add automated tests
- Add Postman collection

Endpoints implemented:
- GET /api/inventory - Search inventory
- GET /api/inventory/{id} - Get inventory details
- POST /api/inventory/add-stock - Add new stock
- POST /api/inventory/adjust-stock - Adjust quantities
- GET /api/inventory/low-stock - Get low stock alerts
- GET /api/inventory/expiring-soon - Get expiring items

Task: 13.7-13.14 COMPLETED"
```

---

## Estimación de Tiempo

| Task | Descripción | Tiempo Estimado |
|------|-------------|-----------------|
| 13.7 | DTOs, Validators, Mappers | 2-3 horas |
| 13.8 | Commands y Queries | 3-4 horas |
| 13.9 | Controller | 2-3 horas |
| 13.10 | Low Stock Alerts | 1-2 horas |
| 13.11 | Validaciones | 1-2 horas |
| 13.12 | Postman Tests | 1-2 horas |
| 13.13 | Integration Tests | 2-3 horas |
| 13.14 | Push Final | 0.5 horas |
| **TOTAL** | | **13-20 horas** |

---

## Recomendaciones

1. **Seguir el mismo patrón exitoso de Dispensations**
   - Usar CQRS
   - FluentValidation
   - AutoMapper
   - Repository pattern

2. **Reutilizar código existente**
   - InventoryRepository ya está creado
   - InventoryConfiguration ya está creado
   - Solo falta implementar la lógica de negocio

3. **Priorizar funcionalidad core**
   - AddStock y AdjustStock son críticos
   - Low stock alerts son importantes
   - Expiring soon es nice-to-have

4. **Testing incremental**
   - Probar cada endpoint al crearlo
   - No esperar al final para testing
   - Usar Docker para pruebas

---

## Próxima Sesión

**Comenzar con Task 13.7:**
1. Crear `InventoryDtos.cs`
2. Crear `InventoryValidators.cs`
3. Crear `InventoryMappingProfile.cs`
4. Compilar y verificar

**Comando para iniciar:**
```bash
# Asegurarse de estar en la rama correcta
git status

# Verificar que el push fue exitoso
git log --oneline -5

# Continuar con Task 13.7
```

---

**Estado Actual: ✅ Task 13.1-13.6 COMPLETADO**

**Siguiente: 📋 Task 13.7-13.14 (Inventory Management)**

**Branch: `feature/task-13-dispensation-inventory-api`**
