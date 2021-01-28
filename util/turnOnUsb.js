const gpio = require("rpi-gpio");

module.exports = async function turnOnUsb(gpioPin) {
  console.log("Turn on USB");
  await gpio.promise.write(gpioPin, gpio.DIR_HIGH);
}
