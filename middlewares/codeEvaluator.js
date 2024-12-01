const axios = require('axios');
const { OpenAI } = require("openai");
const eslint = require('eslint');

// Configura OpenAI con tu API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Cargado desde el archivo .env
});

// Endpoints de las APIs externas
const jdoodleAPI = 'https://api.jdoodle.com/v1/execute';
const pistonAPI = 'https://emkc.org/api/v2/piston/execute';
const compilerExplorerAPI = 'https://godbolt.org/api/compiler';

// **Funciones para interactuar con las APIs externas**

// JDoodle API
async function compileWithJDoodle(code, language) {
  try {
    console.log('Enviando código a JDoodle...');
    const response = await axios.post(jdoodleAPI, {
      script: code,
      language: language,
      versionIndex: "0",
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    });
    if (response.data.error) {
      throw new Error(`JDoodle Error: ${response.data.error}`);
    }
    console.log('Resultado de JDoodle recibido.');
    return response.data;
  } catch (error) {
    console.error('Error en JDoodle API:', error.response?.data || error.message);
    throw error;
  }
}

// Piston API
async function compileWithPiston(code, language) {
  try {
    console.log('Enviando código a Piston API...');
    const response = await axios.post(pistonAPI, {
      language: language,
      source: code,
    });
    if (!response.data || !response.data.run) {
      throw new Error('Piston API Error: Respuesta incompleta.');
    }
    console.log('Resultado de Piston API recibido.');
    return response.data;
  } catch (error) {
    console.error('Error en Piston API:', error.response?.data || error.message);
    throw error;
  }
}

// Compiler Explorer API
async function compileWithCompilerExplorer(code, language) {
  try {
    console.log('Enviando código a Compiler Explorer...');
    const response = await axios.post(compilerExplorerAPI, {
      source: code,
      language: language,
    });
    if (response.data.error) {
      throw new Error(`Compiler Explorer Error: ${response.data.error}`);
    }
    console.log('Resultado de Compiler Explorer recibido.');
    return response.data;
  } catch (error) {
    console.error('Error en Compiler Explorer:', error.response?.data || error.message);
    throw error;
  }
}

// ESLint
async function lintCode(code) {
  try {
    console.log('Analizando código con ESLint...');
    const cli = new eslint.CLIEngine();
    const report = cli.executeOnText(code);
    if (report.errorCount > 0) {
      throw new Error(`ESLint encontró errores: ${JSON.stringify(report.results)}`);
    }
    console.log('Resultado de ESLint recibido.');
    return report.results;
  } catch (error) {
    console.error('Error en ESLint:', error.message);
    throw error;
  }
}

// ChatGPT API
async function askChatGPT(question) {
  try {
    console.log('Enviando consulta a ChatGPT...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    });
    console.log('Respuesta de ChatGPT recibida.');
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error en ChatGPT API:', error.response?.data || error.message);
    throw error;
  }
}

// **Función principal para evaluar código**
async function evaluateCode(code, api) {
  console.log('Evaluando código con API:', api);
  try {
    switch (api) {
      case 'jdoodle':
        return await compileWithJDoodle(code, 'python'); // Cambia el lenguaje según sea necesario
      case 'compilerExplorer':
        return await compileWithCompilerExplorer(code, 'cpp'); // Cambia el lenguaje según sea necesario
      case 'eslint':
        return await lintCode(code);
      case 'piston':
        return await compileWithPiston(code, 'python'); // Cambia el lenguaje según sea necesario
      case 'chatgpt':
        return await askChatGPT(code);
      default:
        throw new Error('API no soportada');
    }
  } catch (error) {
    console.error('Error en evaluateCode:', error.message);
    throw error;
  }
}

// **Exportar las funciones**
module.exports = {
  evaluateCode,
  compileWithJDoodle,
  compileWithPiston,
  compileWithCompilerExplorer,
  lintCode,
  askChatGPT,
};
