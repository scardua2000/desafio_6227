/* 
BANCO: PostgreSQL 
VERSAO: 14.2.2 
PORTA: 5432 
DATABASE: comercial
USUARIO: postgres
SENHA: root 
*/

CREATE DATABASE comercial
    WITH 
    OWNER = postgres
    TEMPLATE = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE proser (
  codpro uuid PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  despro text NOT NULL,
  tippro char,
  sitpro char
);

CREATE TABLE pedido (
  codped uuid PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  sitped char
);

CREATE TABLE iteped (
  codite uuid PRIMARY KEY NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  codped uuid NOT NULL,
  codpro uuid NOT NULL,
  despro text,	
  vlrunt money,	
  vlrdsc money,	
  vlrtot money,		
  FOREIGN KEY (codped) REFERENCES pedido (codped) ON DELETE CASCADE,
  FOREIGN KEY (codpro) REFERENCES proser (codpro) ON DELETE CASCADE
);