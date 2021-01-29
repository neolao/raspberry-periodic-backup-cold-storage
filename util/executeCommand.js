const { spawn } = require("child_process");

module.exports = function executeCommand(command) {
  const commandArgv = command.split(" ");
  const executable = commandArgv.shift();

  return new Promise((resolve, reject) => {
    const childProcess = spawn(executable, commandArgv);
    childProcess.stdout.on("data", data => {
      process.stdout.write(data);
    });
    childProcess.stderr.on("data", data => {
      process.stderr.write(data);
    });

    childProcess.on("close", code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(code);
    });
  });
}
