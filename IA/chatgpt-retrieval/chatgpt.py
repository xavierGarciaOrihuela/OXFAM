import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

import openai
from langchain.chains import ConversationalRetrievalChain, RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.llms import OpenAI
from langchain.vectorstores import Chroma

import constants

os.environ["OPENAI_API_KEY"] = constants.APIKEY

app = Flask(__name__)
CORS(app)

# Enable to save to disk & reuse the model (for repeated queries on the same data)
PERSIST = False

query = None

if PERSIST and os.path.exists("persist"):
    print("Reusing index...\n")
    vectorstore = Chroma(persist_directory="persist", embedding_function=OpenAIEmbeddings())
    index = VectorStoreIndexWrapper(vectorstore=vectorstore)
else:
    # loader = TextLoader("data/data.txt") # Use this line if you only need data.txt
    loader = DirectoryLoader("../../backend/documents/")
    if PERSIST:
        index = VectorstoreIndexCreator(vectorstore_kwargs={"persist_directory": "persist"}).from_loaders([loader])
    else:
        index = VectorstoreIndexCreator().from_loaders([loader])

chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-3.5-turbo"),
    retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
    return_source_documents=True,
)

@app.route('/api/ask', methods=['POST'])
def api_ask():
    global query
    if request.method == 'POST':
        data = request.get_json()
        query = data.get('question', None)
        if query is None:
            return jsonify({'error': 'Missing question in request'})
        result = chain({"question": query, "chat_history": chat_history})
        source_document = result['source_documents'][0]
        source_metadata = source_document.metadata
        source_file_path = source_metadata['source']
        file_name = os.path.basename(source_file_path)
        answer = result['answer']
        chat_history.append((query, answer))
        return jsonify({'source_file_path': file_name, 'answer': answer})
    else:
        return jsonify({'error': 'Invalid request method'})

@app.route('/infographic/<filename>', methods=['POST'])
def api_prompt(filename):
    if request.method == 'POST':
        if filename is None:
            return jsonify({'error': 'Missing question in request'})
        prompt = "My job is to create engaging visual infographics for blog posts. Act like an expert infographics creator and provide a visual description for the infographic that the graphic designer can then implement. The infographic should be visually appealing and easy to understand. The infographic should be based on a summary of the following document:" + filename + ". Make a nice prompt to do an infographic with the title, the style and the content based on the summary of the document"
        result = chain({"question": prompt, "chat_history": chat_history})
        answer = result['answer']
        print(answer)
        # Make a request to another Flask API
        dalle_api_url = 'http://localhost:5001/api/infographic'  # Replace with your other API URL
        dalle_api_data = {'prompt': answer}
        try:
            response = requests.post(dalle_api_url, json=dalle_api_data)
            data = response.json()
            image_url = data.get('image_url', None)
            return jsonify({'url': image_url})
        except requests.exceptions.RequestException as e:
            print(e)
            sys.exit(1)
            return jsonify({'error': str(e)})
        return jsonify({'url': 'https://github.com/'})
    else:
        return jsonify({'error': 'Invalid request method'})

if __name__ == '__main__':
    chat_history = []
    app.run(host='0.0.0.0', port=5000)
