const gpio = require("rpi-gpio");

module.exports = async function turnOnUsb(gpioPin) {
  console.log("Turn off USB");
  await gpio.promise.write(gpioPin, false);
}
