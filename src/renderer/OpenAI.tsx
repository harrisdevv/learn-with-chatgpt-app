
import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data'; // Use default import
import { OpenAPIKey } from './Key';

const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';

async function speechToText(filePath: string) {
  try {
    const formData = new FormData(); // Create a new instance of FormData
    
    // Append the file and model to the form data
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'whisper-1');

    // Make the Axios POST request
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${OpenAPIKey}`,
      },
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error uploading audio:', error);
  }
}

export default speechToText;