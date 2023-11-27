const express = require('express');
var multer = require('multer');
var cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const bcrypt = require('bcrypt')
const { Pool } = require('pg')
const Joi = require('joi');
const cookieParser = require('cookie-parser');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OXFAM',
  password: 'PAE',
  port: 5432,
})

const filesFolderPath = __dirname + "/documents/";

const app = express();
app.use(cookieParser());
app.use(cors());
/*-----*/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, filesFolderPath); // La carpeta ha d'existir
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
const upload = multer({ storage });


app.get('/', function (req, res) {
    res.send('Hello');
});

// Endpoint per obtenir tots els noms dels documents guardats
app.get('/documents', function (req, res) {
    fs.readdir(filesFolderPath, (err, files) => {
        if (err) {
          return res.status(500).json({ error: 'Error reading files folder' });
        }

        const filenames = files.map((file) => ({ name: file }));
        res.status(200).json(filenames);
    });
});

//Endpoint per afegir un nou document, cal que la request compti amb un formdata que contingui un únic fitxer que es digui 'File'
// We can change to accept multiple files: upload.single() -> upload.array()
app.post('/documents', upload.single('File'), function (req, res) {
    // Accede al archivo a través de req.file
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file was sent.');
    }
    //-------
    console.log(req.cookies)
    
    //res.send(req.cookies);
    //-----
    const filename = file.originalname;

    const aux = "pae";
    const date = new Date();
    // Insertar en la base de datos
    const query = 'INSERT INTO Documentos (nombre, autor, fecha, type) VALUES ($1, $2, $3, $4) RETURNING *';
    console.log(query)
    pool.query(query, [filename, aux, date, "public"], (error, result) => {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            return res.status(500).send('Error interno del servidor');
        }
        console.log("TODO OK");
        //res.json({'message': ${filename} successfully uploaded.});
    });
})

// Endpoint per obtenir un fitxer donat el nom
app.get('/documents/:fileName', function (req, res) {
    const fileName = req.params.fileName;
    const filePath = filesFolderPath + fileName; // Make sure the path is correct

    // Use res.sendFile() to send the file to the client
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found.');
        }
    });

    
});

// Endpoint per eliminar un fitxer donat el nom
app.delete('/documents/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    const filePath = filesFolderPath + fileName; // Make sure the path is correct
  
    try {
      // Utilitzem fs.promises.unlink per eliminar el fitxer
      await fs.promises.unlink(filePath);
      res.status(204);
    } catch (error) {
      // Gestionem els errors, per exemple, si no es troba el fitxer
      console.error(`Error while trying to delete ${fileName}`, error);
      res.status(404).send('File not found');
    }
});

// Endpoint per obtenir una resposta a una pregunta per al chat general
// Cal afegir un query parameter al endpoint per a que funcioni: http://localhost:3001/general_chat?question=Test
app.get('/general_chat', async (req, res) => {
  let question = req.query.question;
  if(question === undefined) return res.status(400).send('The question parameter is missing. Example of the use of the endpoint: http://localhost:3001/general_chat?question=Test');
  if(question === '') return res.status(400).send('The question parameter is empty.');
  const flaskApiUrl = 'http://127.0.0.1:5000/api/ask';

  try {
    // Make a POST request to the Flask API
    const response = await axios.post(flaskApiUrl, { question });
    

    // Handle the Flask API response
    const { source_file_path, answer } = response.data;
    console.log(source_file_path)
    console.log(answer)
    console.log(question)
    let source = [source_file_path]
    return res.status(200).json({'question': question, 'answer': answer, 'sources': source});
  } catch (error) {
    console.error('Error making POST request:', error);
    return res.status(500).send('Error making POST request to Flask API');
  }
  
});

app.use(express.json())
const replaceSpecialChars = (text) => { //evitar inyecciones sql
  return text.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

const checkValues = (valueToCheck) => { //Comprobación parámetros entrada
  return replaceSpecialChars(valueToCheck)
}

/*const usernameSchema = Joi.string().alphanum().min(3).max(30).required().messages({
  'string.alphanum': `"username" must only contain alphanumuerical caracters`,
  'string.min': `"username" must have a minimum length of {#limit}`,
  'string.max': `"username" must have a maximum length of {#limit}`,
  'string.empty': `"username" must not be empty`,
  'any.required': `"username" is a required field`,
});

const passwordSchema = Joi.string().min(4).max(64).pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/).required().messages({
  'string.empty': `"password" must not be empty`,
  'string.required': `"password" is required`,
  'string.min': `"password" must have a minimum length of {#limit}`,
  'string.max': `"password" must have a maximum length of {#limit}`,
  'string.pattern.base': `"password" must have at least one digit, one lower case and one upper case characters`,
});

const UserSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
});*/

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  try {
    //const { error, value } = UserSchema.validate(req.body, {abortEarly : false});
    /*if (error) {
        return res.status(400).json({
        status: "error", 
        type: "validation-error",
        title: "Could not validate request paramteters", 
        message: "Username or password are not correct. Please try again."});
    }*/
    const cleanUsername = username;
    const cleanPassword = password;
    /*const cleanUsername = checkValues(value.username)
    console.log(cleanUsername)
    const cleanPassword = checkValues(value.password)
    console.log(cleanPassword)*/
    const query = {
      text: 'SELECT * FROM usuarios WHERE username = $1',
      values: [cleanUsername]
    }
    const user = await pool.query(query)
    if (user.rows[0] && user.rows[0].password == cleanPassword) {
      console.log('id del user: ' + user.rows[0].id);
      res.cookie(`pae cookie`, user.rows[0].id, {expires: 60*60, httpOnly: true});
      res.status(200).send('OK');
    }
    else {
      res.status(404).json({
        status: "error",
        message: "User specified doesn't exist or incorrect password. Please try again" })
      return;
    }
    //const checkPassword = await bcrypt.compare(cleanPassword, user.rows[0].password)
    /*if (checkPassword) res.send('OK')
    else res.status(401).json ({
        status: "error",
        message: "Incorrect password. Please try again" })
      return;*/
  }
catch(error) {
  res.status(500).json({
      statsu: "error",
      message:'Error at logging in. Please try again.'})
}
});


app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  try {
    const { error, value } = UserSchema.validate(req.body, {abortEarly : false});
    if (error) {
        console.error("Error: ", error)
        return res.status(400).json({
            status: "error", 
            type: "validation-error",
            message: "Could not validate request paramteters"})
    }

    const cleanUsername = checkValues(value.username)
    //const cleanPassword = checkValues(value.password)
    console.log('OK');
    const hashedPassword = await bcrypt.hash(value.password, 10)
    try {
      query = {
        text: 'INSERT INTO users(username, password, type) VALUES($1, $2, $3)',
        values: [cleanUsername, hashedPassword, "private"]
      }
      await pool.query(query)
    }
    catch(error) {
      res.status(409).send("User with given username already exists");
      return;
    }
    
    res.status(200).send('OK')
    //pool.release(); 
  }
  catch(error) {
    console.error('Error at registring new user');
    res.status(500).send('Error at registring new user. Please try again');
  }
});


app.listen(3001, function () {
    console.log('Listening on the port 3001!');
});