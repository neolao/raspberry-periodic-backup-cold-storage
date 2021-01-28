const fs = require("fs");
const { execSync, spawn } = require("child_process");
const gpio = require("rpi-gpio");
const sleep = require("./util/sleep");
const turnOnUsb = require("./util/turnOnUsb");
const turnOffUsb = require("./util/turnOffUsb");

const parameters = process.argv.slice(2);
if (parameters.length === 0) {
  console.error("Please provide a configuration file");
  process.exit(1);
}
const configPath = parameters[0];
const config = require(configPath);

console.log("Configuration", config);
console.log("");

function executeCommand(command) {
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

async function setup() {
  gpio.setMode(gpio.MODE_BCM);

  await gpio.promise.setup(config.gpioPin, gpio.DIR_OUT);

  //execSync(`veracrypt --dismount ${config.diskPath}`);
  await turnOffUsb(config.gpioPin);
  await sleep(1000);
  await turnOnUsb(config.gpioPin);

  console.log("Looking for connected disk...");
  let attempts = 30;
  while (!fs.existsSync(config.diskPath)) {
    await sleep(1000);
    attempts--;
    if (attempts <= 0) {
      console.error(`Disk not found: ${config.diskPath}`);
      await turnOffUsb(config.gpioPin);
      process.exit(1);
    }
  }

  console.log("Mount the disk");
  try {
    execSync(`veracrypt --protect-hidden=no --pim=0 --password="" -k ${config.keyFiles.join(",")} ${config.diskPath} ${config.mountPath}`);
  } catch (error) {
    console.error("Unable to mount the disk", error);
    await turnOffUsb(config.gpioPin);
    process.exit(1);
  }
}

async function unmount() {
  console.log("Unmount the disk");
  try {
    execSync(`veracrypt --dismount ${config.diskPath}`);
  } catch (error) {
    console.error("Unable to unmount the disk", error);
  }
}

async function tearDown() {
  await unmount();
  await turnOffUsb(config.gpioPin);
}

async function main() {
  await setup();
	
  console.log("Execute the command");
  try {
    await executeCommand(config.command);
  } catch (error) {
    console.error(error);

    await tearDown();
    process.exit(1);
  }

  await tearDown();

  process.exit(0);
}

main();
