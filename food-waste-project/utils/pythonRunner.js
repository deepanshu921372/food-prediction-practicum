const { PythonShell } = require('python-shell');
const path = require('path');

function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    // Get the correct Python path based on OS
    const pythonPath = process.platform === 'win32' 
      ? path.join(__dirname, '..', 'ml_model', 'venv', 'Scripts', 'python.exe')
      : path.join(__dirname, '..', 'ml_model', 'venv', 'bin', 'python');

    const options = {
      mode: 'text',
      pythonPath: pythonPath,
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, '..', 'ml_model'),
      args: args
    };

    console.log('Running Python script with options:', {
      script: scriptPath,
      scriptPath: options.scriptPath,
      pythonPath: pythonPath,
      args: args
    });

    PythonShell.run(scriptPath, options)
      .then(results => {
        console.log('Python script results:', results);
        resolve(results);
      })
      .catch(err => {
        console.error('Python script error:', err);
        reject(err);
      });
  });
}

module.exports = { runPythonScript }; 