# OXFAM

## Installation

Install Node

### Windows

Go to Node.js web, download stable version and install

https://nodejs.org/es

Download Postgres v16

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads


### Linux

```bash
sudo apt install npm
```
```bash
sudo npm install -g n
sudo n stable
```

```bash
sudo apt-get -y install postgresql
sudo -u postgres psql ALTER USER postgres PASSWORD 'PAE';
```

### Both

Open pgadmin 4 and create a new database called OXFAM with properties:
password: PAE
port: 5432

The execute in a SQL script:
```bash
CREATE TABLE usuarios ( id SERIAL PRIMARY KEY, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, type VARCHAR(10) CHECK (type IN ('public', 'private')) );
CREATE TABLE documentos ( id SERIAL PRIMARY KEY, nombre VARCHAR(255) NOT NULL, autor VARCHAR(255) NOT NULL, fecha DATE NOT NULL, id_chatpdf VARCHAR(255), type VARCHAR(10) CHECK (type IN ('public', 'private')) );

INSERT INTO usuarios (username,password,type) VALUES ('PAE', 'P1A2E3-!','private'); SELECT * FROM usuarios
```

After this, we can login into the app with the credentials:
user: PAE 
password: P1A2E3-!

To create more users, simply execute this line in a SQL script but changing the parameters:

```bash
INSERT INTO usuarios (username,password,type) VALUES ('PAE', 'P1A2E3-!','private'); SELECT * FROM usuarios
```

Clone the project

```bash
  git clone https://github.com/xavierGarciaOrihuela/OXFAM.git
```

Go to the project directory

```bash
  cd OXFAM
```

Go to the backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Go to the frontend directory

```bash
  cd ..
  cd frontend
```

Install dependencies

```bash
  npm install
```

Go to the IA/chatgpt-retrieval directory and create a constants.py file with the OPENAI_API_KEY

```bash
  cd ..
  cd IA/chatgpt-retrieval
  pip install -r requirements.txt
  touch constants.py
  echo APIKEY = "<your-api-key>" >> constants.py
```

## Run Locally

Go to the backend directory

```bash
  cd backend
```

Start the server

```bash
  node index.js
```

Go to the frontend directory

```bash
  cd ..
  cd frontend
```

Start the server

```bash
  npm start
```

Go to the IA/chatgpt-retrieval directory

```bash
  cd ..
  cd IA/chatgpt-retrieval
```

Start the Flask server

```bash
  python chatgpt.py
```
