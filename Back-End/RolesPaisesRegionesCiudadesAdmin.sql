USE petcare_db;

START TRANSACTION;

INSERT INTO `petcare_db`.`roles`
(`name`)
VALUES
("ROLE_ADMIN"),
("ROLE_OWNER"),
("ROLE_SITTER");

-- 2. Insertar países
INSERT IGNORE INTO countries (country_code, name)
VALUES
  ('AR', 'Argentina'),
  ('ES', 'España'),
  ('MX', 'México'),
  ('CO', 'Colombia'),
  ('VE', 'Venezuela'),
  ('EC', 'Ecuador');

-- 3. Insertar regiones
INSERT IGNORE INTO regions (name, country_code)
VALUES
  -- Argentina
  ('Buenos Aires',       'AR'),
  ('Córdoba',            'AR'),
  ('Santa Fe',           'AR'),
  ('Mendoza',            'AR'),
  ('Salta',              'AR'),
  -- España
  ('Madrid',             'ES'),
  ('Cataluña',           'ES'),
  ('Andalucía',          'ES'),
  ('Valencia',           'ES'),
  ('Galicia',            'ES'),
  -- México
  ('Jalisco',            'MX'),
  ('Ciudad de México',   'MX'),
  ('Nuevo León',         'MX'),
  ('Puebla',             'MX'),
  ('Yucatán',            'MX'),
  -- Colombia
  ('Antioquia',          'CO'),
  ('Cundinamarca',       'CO'),
  ('Valle del Cauca',    'CO'),
  ('Santander',          'CO'),
  ('Bolívar',            'CO'),
  -- Venezuela
  ('Caracas',            'VE'),
  ('Zulia',              'VE'),
  ('Miranda',            'VE'),
  ('Carabobo',           'VE'),
  ('Aragua',             'VE'),
  -- Ecuador
  ('Pichincha',          'EC'),
  ('Guayas',             'EC'),
  ('Azuay',              'EC'),
  ('Manabí',             'EC'),
  ('Loja',               'EC');

-- 4. Insertar ciudades referenciando regiones por nombre y código de país
INSERT IGNORE INTO cities (name, region_id)
SELECT 'La Plata',            id FROM regions WHERE name = 'Buenos Aires'       AND country_code = 'AR'
UNION ALL SELECT 'Mar del Plata',     id FROM regions WHERE name = 'Buenos Aires'       AND country_code = 'AR'
UNION ALL SELECT 'Córdoba',           id FROM regions WHERE name = 'Córdoba'            AND country_code = 'AR'
UNION ALL SELECT 'Sampacho',  id FROM regions WHERE name = 'Córdoba'            AND country_code = 'AR'
UNION ALL SELECT 'Rosario',           id FROM regions WHERE name = 'Santa Fe'           AND country_code = 'AR'
UNION ALL SELECT 'Santa Fe',          id FROM regions WHERE name = 'Santa Fe'           AND country_code = 'AR'
UNION ALL SELECT 'Mendoza',           id FROM regions WHERE name = 'Mendoza'            AND country_code = 'AR'
UNION ALL SELECT 'San Rafael',        id FROM regions WHERE name = 'Mendoza'            AND country_code = 'AR'
UNION ALL SELECT 'Salta',             id FROM regions WHERE name = 'Salta'              AND country_code = 'AR'
UNION ALL SELECT 'Cafayate',          id FROM regions WHERE name = 'Salta'              AND country_code = 'AR'

UNION ALL SELECT 'Madrid',            id FROM regions WHERE name = 'Madrid'             AND country_code = 'ES'
UNION ALL SELECT 'Alcalá de Henares', id FROM regions WHERE name = 'Madrid'             AND country_code = 'ES'
UNION ALL SELECT 'Barcelona',         id FROM regions WHERE name = 'Cataluña'           AND country_code = 'ES'
UNION ALL SELECT 'Lleida',            id FROM regions WHERE name = 'Cataluña'           AND country_code = 'ES'
UNION ALL SELECT 'Sevilla',           id FROM regions WHERE name = 'Andalucía'          AND country_code = 'ES'
UNION ALL SELECT 'Granada',           id FROM regions WHERE name = 'Andalucía'          AND country_code = 'ES'
UNION ALL SELECT 'Valencia',          id FROM regions WHERE name = 'Valencia'           AND country_code = 'ES'
UNION ALL SELECT 'Elche',             id FROM regions WHERE name = 'Valencia'           AND country_code = 'ES'
UNION ALL SELECT 'Santiago de Compostela', id FROM regions WHERE name = 'Galicia'     AND country_code = 'ES'
UNION ALL SELECT 'A Coruña',          id FROM regions WHERE name = 'Galicia'            AND country_code = 'ES'

UNION ALL SELECT 'Guadalajara',       id FROM regions WHERE name = 'Jalisco'            AND country_code = 'MX'
UNION ALL SELECT 'Puerto Vallarta',   id FROM regions WHERE name = 'Jalisco'            AND country_code = 'MX'
UNION ALL SELECT 'Ciudad de México',  id FROM regions WHERE name = 'Ciudad de México'   AND country_code = 'MX'
UNION ALL SELECT 'Ecatepec',          id FROM regions WHERE name = 'Ciudad de México'   AND country_code = 'MX'
UNION ALL SELECT 'Monterrey',         id FROM regions WHERE name = 'Nuevo León'         AND country_code = 'MX'
UNION ALL SELECT 'San Nicolás de los Garza', id FROM regions WHERE name = 'Nuevo León' AND country_code = 'MX'
UNION ALL SELECT 'Puebla',            id FROM regions WHERE name = 'Puebla'             AND country_code = 'MX'
UNION ALL SELECT 'Tehuacán',          id FROM regions WHERE name = 'Puebla'             AND country_code = 'MX'
UNION ALL SELECT 'Mérida',            id FROM regions WHERE name = 'Yucatán'            AND country_code = 'MX'
UNION ALL SELECT 'Valladolid',        id FROM regions WHERE name = 'Yucatán'            AND country_code = 'MX'

UNION ALL SELECT 'Medellín',          id FROM regions WHERE name = 'Antioquia'          AND country_code = 'CO'
UNION ALL SELECT 'Bello',             id FROM regions WHERE name = 'Antioquia'          AND country_code = 'CO'
UNION ALL SELECT 'Bogotá',            id FROM regions WHERE name = 'Cundinamarca'       AND country_code = 'CO'
UNION ALL SELECT 'Soacha',            id FROM regions WHERE name = 'Cundinamarca'       AND country_code = 'CO'
UNION ALL SELECT 'Cali',              id FROM regions WHERE name = 'Valle del Cauca'    AND country_code = 'CO'
UNION ALL SELECT 'Palmira',           id FROM regions WHERE name = 'Valle del Cauca'    AND country_code = 'CO'
UNION ALL SELECT 'Bucaramanga',       id FROM regions WHERE name = 'Santander'          AND country_code = 'CO'
UNION ALL SELECT 'Floridablanca',     id FROM regions WHERE name = 'Santander'          AND country_code = 'CO'
UNION ALL SELECT 'Cartagena',         id FROM regions WHERE name = 'Bolívar'            AND country_code = 'CO'
UNION ALL SELECT 'Magangué',          id FROM regions WHERE name = 'Bolívar'            AND country_code = 'CO'

UNION ALL SELECT 'Caracas',           id FROM regions WHERE name = 'Caracas'            AND country_code = 'VE'
UNION ALL SELECT 'Baruta',            id FROM regions WHERE name = 'Caracas'            AND country_code = 'VE'
UNION ALL SELECT 'Maracaibo',         id FROM regions WHERE name = 'Zulia'              AND country_code = 'VE'
UNION ALL SELECT 'Cabimas',           id FROM regions WHERE name = 'Zulia'              AND country_code = 'VE'
UNION ALL SELECT 'Los Teques',        id FROM regions WHERE name = 'Miranda'            AND country_code = 'VE'
UNION ALL SELECT 'Guatire',           id FROM regions WHERE name = 'Miranda'            AND country_code = 'VE'
UNION ALL SELECT 'Valencia',          id FROM regions WHERE name = 'Carabobo'           AND country_code = 'VE'
UNION ALL SELECT 'Puerto Cabello',    id FROM regions WHERE name = 'Carabobo'           AND country_code = 'VE'
UNION ALL SELECT 'Maracay',           id FROM regions WHERE name = 'Aragua'             AND country_code = 'VE'
UNION ALL SELECT 'Turmero',           id FROM regions WHERE name = 'Aragua'             AND country_code = 'VE'

UNION ALL SELECT 'Quito',             id FROM regions WHERE name = 'Pichincha'          AND country_code = 'EC'
UNION ALL SELECT 'Cayambe',           id FROM regions WHERE name = 'Pichincha'          AND country_code = 'EC'
UNION ALL SELECT 'Guayaquil',         id FROM regions WHERE name = 'Guayas'             AND country_code = 'EC'
UNION ALL SELECT 'Daule',             id FROM regions WHERE name = 'Guayas'             AND country_code = 'EC'
UNION ALL SELECT 'Cuenca',            id FROM regions WHERE name = 'Azuay'              AND country_code = 'EC'
UNION ALL SELECT 'Giron',             id FROM regions WHERE name = 'Azuay'              AND country_code = 'EC'
UNION ALL SELECT 'Manta',             id FROM regions WHERE name = 'Manabí'             AND country_code = 'EC'
UNION ALL SELECT 'Portoviejo',        id FROM regions WHERE name = 'Manabí'             AND country_code = 'EC'
UNION ALL SELECT 'Loja',              id FROM regions WHERE name = 'Loja'               AND country_code = 'EC'
UNION ALL SELECT 'Catamayo',          id FROM regions WHERE name = 'Loja'               AND country_code = 'EC';

-- Dirección del admin
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressIdAdmin = LAST_INSERT_ID();

-- Usuario tipo ADMIN
INSERT INTO users (
    user_type,
    created_at,
    deleted,
    email,
    first_name,
    last_name,
    password,
    phone_number,
    profile_image_url,
    updated_at,
    verified,
    address_id
) VALUES (
    "ADMIN",
    "2025-08-28 20:16:51.360199",
    0,
    "admin@example.com",
    "Admin",
    "Example",
    "$2a$10$F2shbpbtSPBV1OMsGZvPeeYmV5J5akFa4xy99Or4cr3Hw3PfQzXES",
    "+544654653",
    NULL,
    NULL,
    1,
    @addressIdAdmin
);
SET @userIdAdmin = LAST_INSERT_ID();

-- Rol ADMIN
INSERT INTO user_roles (user_id, role_id)
VALUES (@userIdAdmin, 1);

-- Sitter 1 - ciudad 1
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressId1 = LAST_INSERT_ID();

INSERT INTO users (user_type, deleted, created_at, email, first_name, last_name, password, phone_number, verified, address_id)
VALUES ("SITTER", 0, NOW(), "sitter1@example.com", "Sitter1", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5411111111", 1, @addressId1);
SET @userId1 = LAST_INSERT_ID();

INSERT INTO sitters (enabled, id) VALUES (1, @userId1);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId1, 3);

-- Sitter 2 - ciudad 1
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressId2 = LAST_INSERT_ID();

INSERT INTO users (user_type, deleted, created_at, email, first_name, last_name, password, phone_number, verified, address_id)
VALUES ("SITTER", 0, NOW(), "sitter2@example.com", "Sitter2", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5422222222", 1, @addressId2);
SET @userId2 = LAST_INSERT_ID();

INSERT INTO sitters (enabled, id) VALUES (1, @userId2);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId2, 3);

-- Sitter 3 - ciudad 1
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressId3 = LAST_INSERT_ID();

INSERT INTO users (user_type, deleted, created_at, email, first_name, last_name, password, phone_number, verified, address_id)
VALUES ("SITTER", 0, NOW(), "sitter3@example.com", "Sitter3", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5433333333", 1, @addressId3);
SET @userId3 = LAST_INSERT_ID();

INSERT INTO sitters (enabled, id) VALUES (1, @userId3);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId3, 3);

-- Sitter 4 - ciudad 9
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 9);
SET @addressId4 = LAST_INSERT_ID();

INSERT INTO users (user_type, deleted, created_at, email, first_name, last_name, password, phone_number, verified, address_id)
VALUES ("SITTER", 0, NOW(), "sitter4@example.com", "Sitter4", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5444444444", 1, @addressId4);
SET @userId4 = LAST_INSERT_ID();

INSERT INTO sitters (enabled, id) VALUES (0, @userId4);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId4, 3);

-- Sitter 5 - ciudad 9
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 9);
SET @addressId5 = LAST_INSERT_ID();

INSERT INTO users (user_type, deleted, created_at, email, first_name, last_name, password, phone_number, verified, address_id)
VALUES ("SITTER", 0, NOW(), "sitter5@example.com", "Sitter5", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5455555555", 1, @addressId5);
SET @userId5 = LAST_INSERT_ID();

INSERT INTO sitters (enabled, id) VALUES (0, @userId5);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId5, 3);

-- Owner 1 - ciudad 1
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressId1 = LAST_INSERT_ID();

INSERT INTO users (user_type, created_at, email, first_name, last_name, password, phone_number, verified, address_id, deleted)
VALUES ("OWNER", NOW(), "owner1@example.com", "Owner1", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5411111111", 1, @addressId1, 0);
SET @userId1 = LAST_INSERT_ID();

INSERT INTO owners (id) VALUES (@userId1);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId1, 2);

-- Mascotas Owner 1
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (3, "Prefiere comida húmeda", 1, "Michi1", "SMALL", "CAT", @userId1);
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (5, "Necesita paseos diarios", 1, "Firulais1", "MEDIUM", "DOG", @userId1);

-- Owner 2 - ciudad 1
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressId2 = LAST_INSERT_ID();

INSERT INTO users (user_type, created_at, email, first_name, last_name, password, phone_number, verified, address_id, deleted)
VALUES ("OWNER", NOW(), "owner2@example.com", "Owner2", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5422222222", 1, @addressId2, 0);
SET @userId2 = LAST_INSERT_ID();

INSERT INTO owners (id) VALUES (@userId2);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId2, 2);

-- Mascotas Owner 2
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (2, "Juguetón y curioso", 1, "Michi2", "SMALL", "CAT", @userId2);
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (4, "Le gusta correr", 1, "Firulais2", "LARGE", "DOG", @userId2);

-- Owner 3 - ciudad 1
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 1);
SET @addressId3 = LAST_INSERT_ID();

INSERT INTO users (user_type, created_at, email, first_name, last_name, password, phone_number, verified, address_id, deleted)
VALUES ("OWNER", NOW(), "owner3@example.com", "Owner3", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5433333333", 1, @addressId3, 0);
SET @userId3 = LAST_INSERT_ID();

INSERT INTO owners (id) VALUES (@userId3);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId3, 2);

-- Mascotas Owner 3
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (1, "Muy tranquilo", 1, "Michi3", "SMALL", "CAT", @userId3);
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (6, "Necesita medicación", 1, "Firulais3", "MEDIUM", "DOG", @userId3);

-- Owner 4 - ciudad 9
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 9);
SET @addressId4 = LAST_INSERT_ID();

INSERT INTO users (user_type, created_at, email, first_name, last_name, password, phone_number, verified, address_id, deleted)
VALUES ("OWNER", NOW(), "owner4@example.com", "Owner4", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5444444444", 1, @addressId4, 0);
SET @userId4 = LAST_INSERT_ID();

INSERT INTO owners (id) VALUES (@userId4);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId4, 2);

-- Mascotas Owner 4
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (4, "Le gusta dormir en el sillón", 1, "Michi4", "MEDIUM", "CAT", @userId4);
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (7, "Come solo alimento seco", 1, "Firulais4", "LARGE", "DOG", @userId4);

-- Owner 5 - ciudad 9
INSERT INTO address (street_address, unit, city_id)
VALUES ("Avenida Siempre Viva 742", "", 9);
SET @addressId5 = LAST_INSERT_ID();

INSERT INTO users (user_type, created_at, email, first_name, last_name, password, phone_number, verified, address_id, deleted)
VALUES ("OWNER", NOW(), "owner5@example.com", "Owner5", "Example", "$2a$12$/DdxDyi.ihNzjC0sSgjj8eeQqGxszkBNhndmZH.LXxGEh83ZrSGiy", "+5455555555", 1, @addressId5, 0);
SET @userId5 = LAST_INSERT_ID();

INSERT INTO owners (id) VALUES (@userId5);
INSERT INTO user_roles (user_id, role_id) VALUES (@userId5, 2);

-- Mascotas Owner 5
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (5, "Tiene alergia a ciertos alimentos", 1, "Michi5", "SMALL", "CAT", @userId5);
INSERT INTO pets (age, care_notes, is_active, name, size_category, species, owner_id)
VALUES (3, "Muy sociable con otros perros", 1, "Firulais5", "MEDIUM", "DOG", @userId5);

COMMIT;