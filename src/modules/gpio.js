var Gpio = require('pigpio').Gpio;
var pins = {};

module.exports = {
	def:{
    	servoWrite: function*(ctx,args){  
    			pin_str = args[0].toString();  	 
				if (!pins[pin_str]) {
  					pins[pin_str] = new Gpio(args[0], {mode: Gpio.OUTPUT});
				}
				pins[pin_str].servoWrite(args[1]);
   	 }
 	}
};
