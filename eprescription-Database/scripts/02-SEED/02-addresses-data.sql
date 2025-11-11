-- =====================================================
-- Script: 02-addresses-data.sql
-- Description: Seed data for addresses table
-- Contains 50 mock addresses across Ecuador
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting addresses data...

-- Addresses in Quito
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Amazonas N24-03 y Colón', 'Quito', 'Pichincha', '170143', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. 6 de Diciembre N34-120 y Checoslovaquia', 'Quito', 'Pichincha', '170515', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Naciones Unidas E2-17 y Av. Amazonas', 'Quito', 'Pichincha', '170135', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. República del Salvador N34-183 y Suiza', 'Quito', 'Pichincha', '170515', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Eloy Alfaro N29-170 y Av. de los Granados', 'Quito', 'Pichincha', '170135', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Mariscal Sucre Oe3-38 y Av. 10 de Agosto', 'Quito', 'Pichincha', '170401', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle García Moreno N10-43 y Mejía', 'Quito', 'Pichincha', '170401', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Occidental N75-100 y Av. Manuel Córdova Galarza', 'Quito', 'Pichincha', '170150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Simón Bolívar Oe2-93 y Av. 10 de Agosto', 'Quito', 'Pichincha', '170401', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Mariana de Jesús E7-113 y Av. Pradera', 'Quito', 'Pichincha', '170135', 'Ecuador');

-- Addresses in Guayaquil
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. 9 de Octubre 100 y Malecón Simón Bolívar', 'Guayaquil', 'Guayas', '090313', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Francisco de Orellana Mz. 111 Solar 1', 'Guayaquil', 'Guayas', '090150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Carlos Julio Arosemena Km 2.5', 'Guayaquil', 'Guayas', '090615', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Víctor Emilio Estrada 815 y Ficus', 'Guayaquil', 'Guayas', '090513', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Juan Tanca Marengo Km 1.5', 'Guayaquil', 'Guayas', '090615', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Tungurahua 1602 y Av. 9 de Octubre', 'Guayaquil', 'Guayas', '090313', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Benjamín Carrión Mora y Av. Guillermo Pareja', 'Guayaquil', 'Guayas', '090150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Las Américas y Av. Kennedy Norte', 'Guayaquil', 'Guayas', '090513', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Hurtado 1309 y Av. Boyacá', 'Guayaquil', 'Guayas', '090313', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Domingo Comín 519 y Av. San Jorge', 'Guayaquil', 'Guayas', '090513', 'Ecuador');

-- Addresses in Cuenca
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. José Peralta 1-95 y Av. 12 de Abril', 'Cuenca', 'Azuay', '010150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Benigno Malo 7-27 y Sucre', 'Cuenca', 'Azuay', '010101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Solano 1-38 y Av. 12 de Abril', 'Cuenca', 'Azuay', '010150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. España y Av. Huayna Cápac', 'Cuenca', 'Azuay', '010150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Presidente Córdova 8-27 y Luis Cordero', 'Cuenca', 'Azuay', '010101', 'Ecuador');

-- Addresses in Ambato
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Cevallos 11-42 y Av. Atahualpa', 'Ambato', 'Tungurahua', '180101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Los Guaytambos y Av. Rodrigo Pachano', 'Ambato', 'Tungurahua', '180206', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Bolívar 15-20 y Castillo', 'Ambato', 'Tungurahua', '180101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Atahualpa 04-25 y Av. 12 de Noviembre', 'Ambato', 'Tungurahua', '180101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Indoamérica Km 3.5', 'Ambato', 'Tungurahua', '180206', 'Ecuador');

-- Addresses in Manta
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. 4 de Noviembre y Calle 13', 'Manta', 'Manabí', '130204', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Flavio Reyes 201 y Calle 15', 'Manta', 'Manabí', '130204', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Malecón Jaime Chávez Franco y Calle 20', 'Manta', 'Manabí', '130204', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. 24 de Mayo y Calle 12', 'Manta', 'Manabí', '130204', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Malecón 105 y Calle 11', 'Manta', 'Manabí', '130204', 'Ecuador');

-- Addresses in Loja
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Manuel Agustín Aguirre 14-38 y Av. Universitaria', 'Loja', 'Loja', '110150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Bolívar 14-80 y Rocafuerte', 'Loja', 'Loja', '110101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Emiliano Ortega 11-50 y Av. Universitaria', 'Loja', 'Loja', '110150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle 10 de Agosto 15-49 y Azuay', 'Loja', 'Loja', '110101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Orillas del Zamora y Av. Salvador Bustamante Celi', 'Loja', 'Loja', '110150', 'Ecuador');

-- Addresses in Machala
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. 25 de Junio y Calle Bolívar', 'Machala', 'El Oro', '070101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle 9 de Mayo entre Guayas y Ayacucho', 'Machala', 'El Oro', '070101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Marcel Laniado de Wind Km 1.5', 'Machala', 'El Oro', '070150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Rocafuerte y Av. 25 de Junio', 'Machala', 'El Oro', '070101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Circunvalación Norte y Av. Ferroviaria', 'Machala', 'El Oro', '070150', 'Ecuador');

-- Addresses in Riobamba
INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Daniel León Borja 35-17 y Av. Canónigo Ramos', 'Riobamba', 'Chimborazo', '060101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Primera Constituyente 23-51 y Larrea', 'Riobamba', 'Chimborazo', '060101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. 9 de Octubre y Av. Lizarzaburu', 'Riobamba', 'Chimborazo', '060150', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Calle Veloz 28-16 y Av. Daniel León Borja', 'Riobamba', 'Chimborazo', '060101', 'Ecuador');

INSERT INTO addresses (street, city, state, postal_code, country) 
VALUES ('Av. Unidad Nacional Km 2.5', 'Riobamba', 'Chimborazo', '060150', 'Ecuador');

COMMIT;

PROMPT Addresses data insertion completed successfully!
PROMPT Total addresses inserted: 50

SET DEFINE ON;
