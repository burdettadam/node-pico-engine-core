var player = require('play-sound')(opts = {});

module.exports = {
    	def:{
        	play: function*(ctx,args){
                player.play(args[0], function(err){
                    if (err) throw err
                })
           	 }
     	}
};
