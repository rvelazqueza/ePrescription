// Catálogo centralizado de farmacias del sistema
export interface PharmacyLocation {
  id: string;
  code: string;
  name: string;
  province: string;
  canton: string;
  district: string;
  specificAddress: string;
  phone: string;
  email?: string;
  manager?: string;
  status: "active" | "inactive" | "maintenance";
  type: "principal" | "sucursal" | "externa";
}

export const pharmacies: PharmacyLocation[] = [
  {
    id: "FARM-001",
    code: "FARM-CENTRAL",
    name: "Farmacia Central Hospital",
    province: "San José",
    canton: "San José",
    district: "Hospital",
    specificAddress: "Edificio Principal, Piso 1, Ala Norte",
    phone: "2222-5500",
    email: "farmacia.central@hospital.cr",
    manager: "Dra. María González",
    status: "active",
    type: "principal"
  },
  {
    id: "FARM-002",
    code: "FARM-EMERG",
    name: "Farmacia Emergencias",
    province: "San José",
    canton: "San José",
    district: "Hospital",
    specificAddress: "Edificio Emergencias, Piso 1",
    phone: "2222-5501",
    email: "farmacia.emergencias@hospital.cr",
    manager: "Dr. Carlos Ramírez",
    status: "active",
    type: "sucursal"
  },
  {
    id: "FARM-003",
    code: "FARM-HOSP",
    name: "Farmacia Hospitalización",
    province: "San José",
    canton: "San José",
    district: "Hospital",
    specificAddress: "Torre de Hospitalización, Piso 3",
    phone: "2222-5502",
    email: "farmacia.hospitalizacion@hospital.cr",
    manager: "Dra. Ana Pérez",
    status: "active",
    type: "sucursal"
  },
  {
    id: "FARM-004",
    code: "FARM-PED",
    name: "Farmacia Pediatría",
    province: "San José",
    canton: "San José",
    district: "Hospital",
    specificAddress: "Pabellón Pediátrico, Piso 2",
    phone: "2222-5503",
    email: "farmacia.pediatria@hospital.cr",
    manager: "Dr. Luis Hernández",
    status: "active",
    type: "sucursal"
  },
  {
    id: "FARM-005",
    code: "FARM-ONCO",
    name: "Farmacia Oncología",
    province: "San José",
    canton: "San José",
    district: "Hospital",
    specificAddress: "Centro de Oncología, Piso 1",
    phone: "2222-5504",
    email: "farmacia.oncologia@hospital.cr",
    manager: "Dra. Patricia Morales",
    status: "active",
    type: "sucursal"
  },
  {
    id: "FARM-006",
    code: "FARM-EXT-CARTAGO",
    name: "Farmacia Externa Cartago",
    province: "Cartago",
    canton: "Cartago Central",
    district: "Oriental",
    specificAddress: "Avenida 2, Calle 4, Edificio Médico Plaza",
    phone: "2551-2200",
    email: "farmacia.cartago@hospital.cr",
    manager: "Dr. Roberto Solís",
    status: "active",
    type: "externa"
  },
  {
    id: "FARM-007",
    code: "FARM-EXT-ALAJUELA",
    name: "Farmacia Externa Alajuela",
    province: "Alajuela",
    canton: "Alajuela",
    district: "Alajuela Centro",
    specificAddress: "Frente al Parque Central, Edificio Los Médicos",
    phone: "2440-1100",
    email: "farmacia.alajuela@hospital.cr",
    manager: "Dra. Silvia Castro",
    status: "active",
    type: "externa"
  },
  {
    id: "FARM-008",
    code: "FARM-UCI",
    name: "Farmacia UCI/Cuidados Intensivos",
    province: "San José",
    canton: "San José",
    district: "Hospital",
    specificAddress: "Unidad de Cuidados Intensivos, Piso 4",
    phone: "2222-5505",
    email: "farmacia.uci@hospital.cr",
    manager: "Dr. Fernando Rojas",
    status: "active",
    type: "sucursal"
  }
];

// Función helper para obtener farmacia por ID
export function getPharmacyById(id: string): PharmacyLocation | undefined {
  return pharmacies.find(p => p.id === id);
}

// Función helper para obtener farmacias activas
export function getActivePharmacies(): PharmacyLocation[] {
  return pharmacies.filter(p => p.status === "active");
}

// Función helper para obtener el nombre completo de ubicación
export function getFullAddress(pharmacy: PharmacyLocation): string {
  return `${pharmacy.specificAddress}, ${pharmacy.district}, ${pharmacy.canton}, ${pharmacy.province}`;
}

// Función helper para formatear la información de farmacia para mostrar
export function formatPharmacyInfo(pharmacyId: string): {
  name: string;
  location: string;
  phone: string;
  manager: string;
  code: string;
} | null {
  const pharmacy = getPharmacyById(pharmacyId);
  if (!pharmacy) return null;

  return {
    name: pharmacy.name,
    location: getFullAddress(pharmacy),
    phone: pharmacy.phone,
    manager: pharmacy.manager || "No asignado",
    code: pharmacy.code
  };
}
