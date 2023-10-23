# OXFAM

## Installation

Install Node

### Windows

Go to Node.js web, download stable version and install

https://nodejs.org/es

### Linux

```bash
sudo apt install npm
```
```bash
sudo npm install -g n
sudo n stable
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

Go to the IA/chatgpt-retrieval directory and create a constants.py file with the OPENAI_API_KEY

```bash
  cd ..
  cd IA/chatgpt-retrieval
  pip install -r requirements.txt
  touch constants.py
  echo APIKEY = "<your-api-key>" >> constants.py
```

Start the Flask server

```bash
  python chatgpt.py
```
