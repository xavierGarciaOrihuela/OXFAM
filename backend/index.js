const express = require('express');
var multer = require('multer');
var cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const bcrypt = require('bcrypt')
const { Pool } = require('pg')
const Joi = require('joi');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const FormData = require("form-data");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'OXFAM',
  password: 'PAE',
  port: 5432,
})

const filesFolderPath = __dirname + "/documents/";
const chatPDF_api_key = process.env.CHATPDF_API_KEY;

const app = express();
app.use(cookieParser());
//app.use(cors());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
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
app.get('/documents', async (req, res) => {
    const token = req.cookies['access_token'];
    let query = null;
    let filenames = [];
      if (token.type == 'private') {
        query = {
          text: 'SELECT nombre, autor, fecha, type FROM documentos'
        }
        const docs = await pool.query(query);
        if (docs.rowCount > 0) {
          docs.rows.forEach((document) => {
            filenames.push({name: document.nombre, author: document.autor, date: document.fecha, type: document.type, can_delete: (token.username == document.autor ? true : false )});
          });
        
        }  
      }
      else {
        query = {
          text: 'SELECT nombre, autor, fecha, type FROM documentos WHERE type = $1',
          values: [token.type]
        }   
        const docs = await pool.query(query);
        if (docs.rowCount >= 0) {
          docs.rows.forEach((document) => {
            //nombre = document.nombre; 
            filenames.push({ name: document.nombre, author: document.autor, date: document.fecha, type: '', can_delete: (token.username == document.autor ? true : false)});
          });
        }
      }
    res.status(200).json(filenames);
});

//Endpoint per afegir un nou document, cal que la request compti amb un formdata que contingui un únic fitxer que es digui 'File'
// We can change to accept multiple files: upload.single() -> upload.array()
app.post('/documents', upload.single('File'), async function (req, res) {
    const token = req.cookies['access_token'];
    // Accede al archivo a través de req.file
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file was sent.');
    }
    //-----
    const filename = file.originalname;

    const aux = "pae";
    const date = new Date();

    // Pujem el document a ChatPDF i guardem el ID que retorna
    let document_chatpdf_id = null;
    if(chatPDF_api_key) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filesFolderPath + file.originalname));

      const options = {
        headers: {
          "x-api-key": chatPDF_api_key,
          ...formData.getHeaders(),
        },
      };
        
      await axios.post("https://api.chatpdf.com/v1/sources/add-file", formData, options)
      .then((response) => {
        // Guardar ID en la base de datos
        document_chatpdf_id = response.data.sourceId;
        console.log("Chatpdf Document ID:", response.data.sourceId);
      })
      .catch((error) => {
        console.log("Error when uploading to ChatPDF:", error);
      });
    } else {
      console.log("NO api_key provided for ChatPDF");
    }
    
    const type = (token.type == 'private' ? (req.body.Type == 'true' ? 'private' : 'public') : 'public');

    // Insertar en la base de datos
    const query = 'INSERT INTO Documentos (nombre, autor, fecha, id_chatpdf, type) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    pool.query(query, [filename, token.username, date, document_chatpdf_id, type], (error, result) => {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            return res.status(500).send('Error interno del servidor');
        }
        if(result) {
          return res.status(201).json({'message': `${file.originalname} successfully uploaded.`});
        }
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

async function getDocumentChatPDFid (documentName) {
  const query = 'SELECT id_chatpdf FROM documentos WHERE nombre = $1';
  const id = await pool.query(query, [documentName]);
  return id.rows[0].id_chatpdf;
};

// Endpoint per eliminar un fitxer donat el nom
app.delete('/documents/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    const filePath = filesFolderPath + fileName; // Make sure the path is correct
  
    try {
      const chatpdfID = await getDocumentChatPDFid(fileName);
      if(chatPDF_api_key && chatpdfID !== null) {
        const config = {
          headers: {
            "x-api-key": chatPDF_api_key,
            "Content-Type": "application/json",
          },
        };
        // Obtenir primer el sourceId del document
        const data = {
          sources: [chatpdfID],
        };

        axios.post("https://api.chatpdf.com/v1/sources/delete", data, config)
        .then((response) => {
          console.log("Success in deleteing the document");
        })
        .catch((error) => {
          
        });
      }
      // Utilitzem fs.promises.unlink per eliminar el fitxer
      await fs.promises.unlink(filePath);
      const query = 'DELETE FROM documentos WHERE nombre = $1';
      await pool.query(query, [fileName]);
      res.status(204);
    } catch (error) {
      // Gestionem els errors, per exemple, si no es troba el fitxer
      console.error(`Error while trying to delete ${fileName}`, error);
      res.status(404).send('File not found');
    }
});

app.post('/documents/:filename/infographic', async (req, res) => {
  try {
    const fileName = req.params.filename;
    const flaskApiUrl2 = 'http://127.0.0.1:5000';

    const response = await axios.post(flaskApiUrl2 + "/infographic/" + fileName);
    const url = response.data.url;

    return res.status(200).json({ url: url});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
});


app.get('/individual_chat/:filename', async (req, res) => {
  const fileName = req.params.filename;
  const chatpdfID = await getDocumentChatPDFid(fileName);
  if(chatPDF_api_key && chatpdfID != null){
    let question = req.query.question;
    if(question === undefined) res.status(400).send('The question parameter is missing. Example of the use of the endpoint: http://localhost:3001/general_chat?question=Test');
    if(question === '') res.status(400).send('The question parameter is empty.');
    // Obtenir el sourceId que li correspongui al document
    const config = {
      headers: {
        'x-api-key': chatPDF_api_key,
        'Content-Type': "application/json",
      },
    };

    const data = {
      'sourceId': chatpdfID,
      'messages': [
        {
          'role': "user",
          'content': question,
        }
      ]
    };

    axios.post("https://api.chatpdf.com/v1/chats/message", data, config)
    .then((response) => {
      res.status(200).json({'question': question, 'answer': response.data.content, 'sources': []})
    })
    .catch((error) => {
      console.log(error.message);
      console.log("Response:", error.response.data);
      res.status(500).send(error.message);
    });
  } else {
    console.log('Access to ChatPDF is closed')
    res.status(200).json({'question': '', 'answer': 'ERROR: Access to ChatPDF is closed', 'sources': []})
  }
});

// Endpoint per obtenir una resposta a una pregunta per al chat general
// Cal afegir un query parameter al endpoint per a que funcioni: http://localhost:3001/general_chat?question=Test
app.get('/general_chat', async (req, res) => {
  const token = req.cookies['access_token'];
  //-----------------
  let question = req.query.question;
  if(question === undefined) return res.status(400).send('The question parameter is missing. Example of the use of the endpoint: http://localhost:3001/general_chat?question=Test');
  if(question === '') return res.status(400).send('The question parameter is empty.');
  const flaskApiUrl = 'http://127.0.0.1:5000/api/ask';

  try {
    // Make a POST request to the Flask API
    const response = await axios.post(flaskApiUrl, { question });
    

    // Handle the Flask API response
    const { source_file_path, answer } = response.data;
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
      const user_info = {
        username: user.rows[0].username,
        type: user.rows[0].type,
      };
      //console.log('user_info: '+user_info);
      res.cookie('access_token', user_info, { maxAge: 86400000, httpOnly: true, sameSite: 'None', secure: true });
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



