-- =====================================================
-- Script: 02-addresses.sql
-- Descripción: Crear tabla de direcciones (compartida)
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla ADDRESSES
CREATE TABLE ADDRESSES (
    address_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    street_address VARCHAR2(200) NOT NULL,
    city VARCHAR2(100) NOT NULL,
    state_province VARCHAR2(100) NOT NULL,
    postal_code VARCHAR2(20),
    country VARCHAR2(100) DEFAULT 'Costa Rica' NOT NULL,
    latitude NUMBER(10,7),
    longitude NUMBER(10,7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_address_city ON ADDRESSES(city);
CREATE INDEX idx_address_postal_code ON ADDRESSES(postal_code);
CREATE INDEX idx_address_coordinates ON ADDRESSES(latitude, longitude);

-- Comentarios
COMMENT ON TABLE ADDRESSES IS 'Direcciones físicas compartidas por múltiples entidades';
COMMENT ON COLUMN ADDRESSES.address_id IS 'Identificador único de la dirección';
COMMENT ON COLUMN ADDRESSES.street_address IS 'Dirección completa de la calle';
COMMENT ON COLUMN ADDRESSES.city IS 'Ciudad o cantón';
COMMENT ON COLUMN ADDRESSES.state_province IS 'Provincia o estado';
COMMENT ON COLUMN ADDRESSES.postal_code IS 'Código postal';
COMMENT ON COLUMN ADDRESSES.latitude IS 'Latitud para geolocalización';
COMMENT ON COLUMN ADDRESSES.longitude IS 'Longitud para geolocalización';

COMMIT;

EXIT;
