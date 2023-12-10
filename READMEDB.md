DB INSTALLATION
Descargar la versión 16 de postgres
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

// En linux: 
sudo apt-get -y install postgresql

Ir a https://www.pgadmin.org/download/pgadmin-4-apt/ y seguir pasos

Luego en la terminal

sudo -u postgres psql
ALTER USER postgres PASSWORD 'PAE';

password: PAE
Puerto: 5432

Una vez descargado abrir pgAdmin 4 y crear una nueva base de datos "OXFAM"


Arriba izquierda iniciamos BD e introducir la siguiente query:
-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('public', 'private'))
);

-- Tabla de documentos
    CREATE TABLE documentos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        id_chatpdf VARCHAR(255), 
        type VARCHAR(10) CHECK (type IN ('public', 'private'))
    );
INSERT INTO usuarios (username,password,type) VALUES ('PAE', 'P1A2E3-!','private');
SELECT * FROM usuarios

--DROP TABLE usuarios;DROP TABLE documentos;



LOGIN EN LA APP:
user:PAE
pws:P1A2E3-!