const path = require( 'path' );

module.exports = {

	mode:"development",
	entry:{
		pixmat:"./src/index.js"
	},
	output:{

		path:path.resolve( __dirname, "dist"),
		publicPath:"dist/",
		filename:"[name].dev.bundle.js",
		chunkFilename:"dev/[name].bundle.js",
		library:"pixmat"
	},
	resolve:{
		modules:[
			path.resolve( __dirname, "src"),
			"node_modules"
		],

		alias:{
			'config':'config_dev',
			'data':'data'
		}
	}

};