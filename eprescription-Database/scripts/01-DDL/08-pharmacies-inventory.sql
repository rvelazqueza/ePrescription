-- =====================================================
-- Script: 08-pharmacies-inventory.sql
-- Descripción: Crear tablas de farmacias, inventario y dispensación
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla PHARMACIES
CREATE TABLE PHARMACIES (
    pharmacy_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    pharmacy_name VARCHAR2(200) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,
    address_id RAW(16),
    phone VARCHAR2(20),
    email VARCHAR2(200),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES ADDRESSES(address_id)
);

-- Crear tabla INVENTORY
CREATE TABLE INVENTORY (
    inventory_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    pharmacy_id RAW(16) NOT NULL,
    medication_id RAW(16) NOT NULL,
    batch_number VARCHAR2(50) NOT NULL,
    quantity_available NUMBER(10,2) NOT NULL CHECK (quantity_available >= 0),
    expiration_date DATE NOT NULL,
    unit_cost NUMBER(10,2) CHECK (unit_cost >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES PHARMACIES(pharmacy_id),
    FOREIGN KEY (medication_id) REFERENCES MEDICATIONS(medication_id),
    CONSTRAINT uq_pharmacy_medication_batch UNIQUE (pharmacy_id, medication_id, batch_number),
    CONSTRAINT chk_expiration_future CHECK (expiration_date > SYSDATE - 365)
);

-- Crear tabla DISPENSATIONS
CREATE TABLE DISPENSATIONS (
    dispensation_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    pharmacy_id RAW(16) NOT NULL,
    pharmacist_id RAW(16),
    dispensation_date TIMESTAMP NOT NULL,
    status VARCHAR2(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'verified', 'completed', 'rejected')),
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id),
    FOREIGN KEY (pharmacy_id) REFERENCES PHARMACIES(pharmacy_id)
);

-- Crear tabla DISPENSATION_ITEMS (4NF - ítems dispensados)
CREATE TABLE DISPENSATION_ITEMS (
    dispensation_item_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    dispensation_id RAW(16) NOT NULL,
    prescription_medication_id RAW(16) NOT NULL,
    inventory_id RAW(16) NOT NULL,
    quantity_dispensed NUMBER(10,2) NOT NULL CHECK (quantity_dispensed > 0),
    batch_number VARCHAR2(50),
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispensation_id) REFERENCES DISPENSATIONS(dispensation_id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_medication_id) REFERENCES PRESCRIPTION_MEDICATIONS(prescription_medication_id),
    FOREIGN KEY (inventory_id) REFERENCES INVENTORY(inventory_id)
);

-- Índices para PHARMACIES
CREATE INDEX idx_pharmacy_name ON PHARMACIES(UPPER(pharmacy_name));
CREATE INDEX idx_pharmacy_license ON PHARMACIES(license_number);
CREATE INDEX idx_pharmacy_active ON PHARMACIES(is_active);
CREATE INDEX idx_pharmacy_address ON PHARMACIES(address_id);

-- Índices para INVENTORY
CREATE INDEX idx_inventory_pharmacy ON INVENTORY(pharmacy_id);
CREATE INDEX idx_inventory_medication ON INVENTORY(medication_id);
CREATE INDEX idx_inventory_batch ON INVENTORY(batch_number);
CREATE INDEX idx_inventory_expiration ON INVENTORY(expiration_date);
CREATE INDEX idx_inventory_quantity ON INVENTORY(quantity_available);

-- Índices para DISPENSATIONS
CREATE INDEX idx_dispensation_prescription ON DISPENSATIONS(prescription_id);
CREATE INDEX idx_dispensation_pharmacy ON DISPENSATIONS(pharmacy_id);
CREATE INDEX idx_dispensation_pharmacist ON DISPENSATIONS(pharmacist_id);
CREATE INDEX idx_dispensation_date ON DISPENSATIONS(dispensation_date);
CREATE INDEX idx_dispensation_status ON DISPENSATIONS(status);

-- Índices para DISPENSATION_ITEMS
CREATE INDEX idx_disp_item_dispensation ON DISPENSATION_ITEMS(dispensation_id);
CREATE INDEX idx_disp_item_presc_med ON DISPENSATION_ITEMS(prescription_medication_id);
CREATE INDEX idx_disp_item_inventory ON DISPENSATION_ITEMS(inventory_id);
CREATE INDEX idx_disp_item_batch ON DISPENSATION_ITEMS(batch_number);

-- Comentarios
COMMENT ON TABLE PHARMACIES IS 'Farmacias registradas en el sistema';
COMMENT ON TABLE INVENTORY IS 'Inventario de medicamentos por farmacia y lote';
COMMENT ON TABLE DISPENSATIONS IS 'Registro de dispensaciones de prescripciones';
COMMENT ON TABLE DISPENSATION_ITEMS IS 'Ítems dispensados por dispensación (4NF)';
COMMENT ON COLUMN INVENTORY.batch_number IS 'Número de lote del medicamento';
COMMENT ON COLUMN INVENTORY.quantity_available IS 'Cantidad disponible en inventario';
COMMENT ON COLUMN DISPENSATIONS.status IS 'Estado: pending, verified, completed, rejected';
COMMENT ON COLUMN DISPENSATION_ITEMS.quantity_dispensed IS 'Cantidad dispensada del medicamento';

COMMIT;

EXIT;
