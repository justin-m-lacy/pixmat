import * as PIXI from 'pixi.js'
import PhysicsGame from './physicsGame';

import { rigidShape } from './matterUtils';
import { GameObject } from 'gibbon.js';

//export function run() {

	const app = new PIXI.Application({

		backgroundColor:0xFFFFFF,
		width:800,
		height:400,
		transparent:false,
		antialias:true

	});

	document.body.appendChild( app.view );


	app.loader.load();
	let g = new PhysicsGame( app );
	g.init();

	g.start();

	makeSquare(g);

//}

/**
 * 
 * @param {Game} [game=null] Game to add square to.
 * @returns {GameObject}
 */
function makeSquare( game=null ) {

	let rect = new PIXI.Rectangle(0,0,222,222);
	let go = rigidShape( rect,
		new PIXI.GraphicsData( 2,0,1,0xffff00, 1, true, true, rect, 0.5)
	);

	if ( !go ) return null;

	if ( game ) game.addObject( go );

	return go;

}