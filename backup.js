const fs = require("fs");
const { execSync, spawn } = require("child_process");
const gpio = require("rpi-gpio");
const sleep = require("./util/sleep");
const turnOnUsb = require("./util/turnOnUsb");
const turnOffUsb = require("./util/turnOffUsb");
const waitForDisk = require("./util/waitForDisk");
const executeCommand = require("./util/executeCommand");
const mountDisk = require("./util/mountDisk");
const unmountDisk = require("./util/unmountDisk");

const parameters = process.argv.slice(2);
if (parameters.length === 0) {
  console.error("Please provide a configuration file");
  process.exit(1);
}
const configPath = parameters[0];
const config = require(configPath);

console.log("Configuration", config);
console.log("");

async function tearDown() {
  try {
    unmountDisk(config.diskPath);
  } catch (error) {
    console.error("Unable to unmount the disk", error);
  }
  await turnOffUsb(config.gpioPin);
}

async function main() {
  gpio.setMode(gpio.MODE_BCM);

  await gpio.promise.setup(config.gpioPin, gpio.DIR_OUT);

  try {
    unmountDisk(config.diskPath);
  } catch (error) {}
  await turnOffUsb(config.gpioPin);
  await sleep(1000);
  await turnOnUsb(config.gpioPin);

  try {
    await waitForDisk(config.diskPath);
  } catch (error) {
    console.error(`Disk not found: ${config.diskPath}`);
    await turnOffUsb(config.gpioPin);
    process.exit(1);
  }

  try {
    mountDisk(config.diskPath, config.mountPath, config.keyFiles);
  } catch (error) {
    console.error("Unable to mount the disk", error);
    await turnOffUsb(config.gpioPin);
    process.exit(1);
  }

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
