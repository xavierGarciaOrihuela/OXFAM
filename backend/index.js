var express = require('express');
var multer = require('multer');
var cors = require('cors');
const fs = require('fs');
const axios = require('axios');


const filesFolderPath = __dirname + "/documents/";

var app = express();

app.use(cors());
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



app.listen(3001, function () {
    console.log('Listening on the port 3001!');
});