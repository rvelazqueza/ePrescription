-- =====================================================
-- Script: 02-addresses-data.sql
-- Description: Seed data for ADDRESSES table
-- Contains 50 mock addresses across Costa Rica
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting ADDRESSES data (Costa Rica)
PROMPT ========================================

-- Clear existing data
DELETE FROM ADDRESSES;

PROMPT Inserting 50 addresses from Costa Rica...

-- San José Province (15 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Avenida Central, Calle 2-4', 'San José Centro', 'San José', '10101', 'Costa Rica', 9.9281, -84.0907);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Escazú Centro, 200m sur del Banco Nacional', 'Escazú', 'San José', '10201', 'Costa Rica', 9.9189, -84.1404);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Santa Ana Centro, frente al parque', 'Santa Ana', 'San José', '10901', 'Costa Rica', 9.9342, -84.1871);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Desamparados Centro, 100m norte de la iglesia', 'Desamparados', 'San José', '10301', 'Costa Rica', 9.8989, -84.0661);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Puriscal Centro, diagonal a la municipalidad', 'Puriscal', 'San José', '10801', 'Costa Rica', 9.7231, -84.3689);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Tarrazú Centro, 50m este del correo', 'Tarrazú', 'San José', '10701', 'Costa Rica', 9.6342, -84.0123);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Aserrí Centro, contiguo al banco', 'Aserrí', 'San José', '10401', 'Costa Rica', 9.8567, -84.1045);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Mora Centro, 200m sur de la plaza', 'Mora', 'San José', '10501', 'Costa Rica', 9.9123, -84.2789);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Goicoechea Centro, frente al mercado', 'Goicoechea', 'San José', '10601', 'Costa Rica', 9.9567, -84.0234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Santa Ana, Pozos, 300m oeste del cementerio', 'Santa Ana', 'San José', '10902', 'Costa Rica', 9.9278, -84.1956);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Curridabat Centro, 100m norte del parque', 'Curridabat', 'San José', '11801', 'Costa Rica', 9.9234, -84.0345);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Montes de Oca, San Pedro, 200m sur de la UCR', 'Montes de Oca', 'San José', '11501', 'Costa Rica', 9.9345, -84.0512);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Turrubares Centro, diagonal a la escuela', 'Turrubares', 'San José', '11001', 'Costa Rica', 9.8456, -84.3234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Dota, Santa María, 100m este de la iglesia', 'Dota', 'San José', '11101', 'Costa Rica', 9.5678, -83.9456);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('León Cortés Centro, frente al banco', 'León Cortés', 'San José', '11201', 'Costa Rica', 9.6789, -84.0567);

-- Alajuela Province (10 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Alajuela Centro, Avenida 1, Calle Central', 'Alajuela', 'Alajuela', '20101', 'Costa Rica', 10.0162, -84.2111);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('San Ramón Centro, 100m sur del parque', 'San Ramón', 'Alajuela', '20201', 'Costa Rica', 10.0857, -84.4681);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Grecia Centro, diagonal a la iglesia', 'Grecia', 'Alajuela', '20301', 'Costa Rica', 10.0717, -84.3089);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('San Mateo Centro, 200m norte del correo', 'San Mateo', 'Alajuela', '20401', 'Costa Rica', 9.9567, -84.5234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Atenas Centro, contiguo al mercado', 'Atenas', 'Alajuela', '20501', 'Costa Rica', 9.9789, -84.3789);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Naranjo Centro, 50m oeste de la plaza', 'Naranjo', 'Alajuela', '20601', 'Costa Rica', 10.0956, -84.3823);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Palmares Centro, frente al banco', 'Palmares', 'Alajuela', '20701', 'Costa Rica', 10.0534, -84.4345);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Poás Centro, 100m sur de la municipalidad', 'Poás', 'Alajuela', '20801', 'Costa Rica', 10.1234, -84.2345);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Orotina Centro, diagonal a la escuela', 'Orotina', 'Alajuela', '20901', 'Costa Rica', 9.9123, -84.5234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('San Carlos, Ciudad Quesada, 200m este del parque', 'San Carlos', 'Alajuela', '21001', 'Costa Rica', 10.3267, -84.4289);

-- Cartago Province (8 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Cartago Centro, Avenida 2, Calle 4', 'Cartago', 'Cartago', '30101', 'Costa Rica', 9.8644, -83.9194);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Paraíso Centro, 100m norte de la iglesia', 'Paraíso', 'Cartago', '30201', 'Costa Rica', 9.8345, -83.8567);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('La Unión Centro, frente al mercado', 'La Unión', 'Cartago', '30301', 'Costa Rica', 9.9234, -84.0012);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Jiménez Centro, 200m sur del correo', 'Jiménez', 'Cartago', '30401', 'Costa Rica', 9.7456, -83.7234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Turrialba Centro, diagonal al banco', 'Turrialba', 'Cartago', '30501', 'Costa Rica', 9.9056, -83.6817);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Alvarado Centro, 50m oeste de la plaza', 'Alvarado', 'Cartago', '30601', 'Costa Rica', 10.0123, -83.8234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Oreamuno Centro, contiguo a la escuela', 'Oreamuno', 'Cartago', '30701', 'Costa Rica', 9.9567, -83.8901);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('El Guarco Centro, 100m este de la municipalidad', 'El Guarco', 'Cartago', '30801', 'Costa Rica', 9.8234, -83.8567);

-- Heredia Province (7 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Heredia Centro, Avenida Central, Calle 2', 'Heredia', 'Heredia', '40101', 'Costa Rica', 9.9989, -84.1167);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Barva Centro, 200m sur del parque', 'Barva', 'Heredia', '40201', 'Costa Rica', 10.0234, -84.1345);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Santo Domingo Centro, frente a la iglesia', 'Santo Domingo', 'Heredia', '40301', 'Costa Rica', 9.9789, -84.0789);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Santa Bárbara Centro, 100m norte del correo', 'Santa Bárbara', 'Heredia', '40401', 'Costa Rica', 10.0345, -84.1567);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('San Rafael Centro, diagonal al banco', 'San Rafael', 'Heredia', '40501', 'Costa Rica', 10.0123, -84.1234);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('San Isidro Centro, 50m oeste de la plaza', 'San Isidro', 'Heredia', '40601', 'Costa Rica', 10.0567, -84.1678);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Belén Centro, contiguo al mercado', 'Belén', 'Heredia', '40701', 'Costa Rica', 9.9678, -84.1789);

-- Guanacaste Province (5 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Liberia Centro, Avenida Central', 'Liberia', 'Guanacaste', '50101', 'Costa Rica', 10.6339, -85.4378);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Nicoya Centro, 100m sur del parque', 'Nicoya', 'Guanacaste', '50201', 'Costa Rica', 10.1489, -85.4522);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Santa Cruz Centro, frente a la iglesia', 'Santa Cruz', 'Guanacaste', '50301', 'Costa Rica', 10.2656, -85.5856);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Bagaces Centro, 200m norte del correo', 'Bagaces', 'Guanacaste', '50401', 'Costa Rica', 10.5234, -85.2567);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Carrillo, Filadelfia, diagonal al banco', 'Carrillo', 'Guanacaste', '50501', 'Costa Rica', 10.4567, -85.5234);

-- Puntarenas Province (3 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Puntarenas Centro, Paseo de los Turistas', 'Puntarenas', 'Puntarenas', '60101', 'Costa Rica', 9.9756, -84.8339);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Esparza Centro, 100m sur de la plaza', 'Esparza', 'Puntarenas', '60201', 'Costa Rica', 9.9456, -84.6678);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Buenos Aires Centro, frente al mercado', 'Buenos Aires', 'Puntarenas', '60301', 'Costa Rica', 9.1678, -83.3345);

-- Limón Province (2 addresses)
INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Limón Centro, Avenida 1, Calle 3', 'Limón', 'Limón', '70101', 'Costa Rica', 9.9906, -83.0353);

INSERT INTO ADDRESSES (STREET_ADDRESS, CITY, STATE_PROVINCE, POSTAL_CODE, COUNTRY, LATITUDE, LONGITUDE) 
VALUES ('Pococí, Guápiles, 200m este del parque', 'Pococí', 'Limón', '70201', 'Costa Rica', 10.2167, -83.7833);

COMMIT;

PROMPT 
PROMPT ========================================
PROMPT ADDRESSES Data Completed!
PROMPT ========================================
PROMPT Total addresses inserted: 50
PROMPT Distribution:
PROMPT - San José: 15 addresses
PROMPT - Alajuela: 10 addresses  
PROMPT - Cartago: 8 addresses
PROMPT - Heredia: 7 addresses
PROMPT - Guanacaste: 5 addresses
PROMPT - Puntarenas: 3 addresses
PROMPT - Limón: 2 addresses
PROMPT ========================================

EXIT;
