var express = require('express');
var multer = require('multer');
var cors = require('cors');
const fs = require('fs');


const filesFolderPath = __dirname + "/documents/";

var app = express();

app.use(cors());

/*-----*/
const db = mysql.createConnection({
  host: 'tu_host_de_mysql',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

// JWT Secret Key (se recomienda almacenar en variables de entorno)
const secretKey = 'tu_clave_secreta';

// Middleware para verificar el token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token not provided');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
}

// Nuevo endpoint para el inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Aquí deberías realizar la autenticación con la base de datos
  // Consulta SQL para verificar el usuario y contraseña

  const user = {
    username,
    // Otros datos del usuario que quieras incluir en el token
  };

  // Generar el token
  jwt.sign({ user }, secretKey, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      return res.status(500).json({ error: 'Error generating token' });
    }
    res.json({ token });
  });
});

// Proteger rutas con el middleware verifyToken
app.get('/secure-route', verifyToken, (req, res) => {
  res.json({ message: 'This is a secure route' });
});
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

    res.json({'message': `${file.originalname} successfully uploaded.`})
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
  let answer = 'Això és una resposta temporal';
  let sources = ['Grup PAE OXFAM', 'Temp Source', 'Informe 1', 'Informe 2', 'Lorem ipsum.pdf'];
  return res.status(200).json({'question': question, 'answer': answer, 'sources': sources});
});





app.listen(3001, function () {
    console.log('Listening on the port 3001!');
});