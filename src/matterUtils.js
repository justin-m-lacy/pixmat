/**
 * Utilities for matching Matter physics objects with PIXI DisplayObjects.
*/
import * as Matter from 'matter-js';
import { GameObject } from 'gibbon.js';
import { createShape } from 'gibbon.js/utils/drawUtils.js';
import RigidBody from './components/rigidBody';
import * as PIXI from 'pixi.js';

const Composite = Matter.Composite;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Vector = Matter.Vector;

/**
 * Create a GameObject with a RigidBody from a PIXI Shape. Note that the Body's actual x,y position
 * is the center of the shape.
 * RoundRect is currently unsupported. TODO: Add RoundRect support.
 * @param {PIXI.Rectangle|PIXI.Circle|PIXI.Polygon|PIXI.Ellipse} graphicsData.shape
 * @param {GraphicsData|Object} [graphicsData=null] Data for drawing the shape. Leave null if no graphic of
 * the shape should be provided.
 * @returns {GameObject|null} The GameObject created, or null if shape constant
 * is invalid.
 */
function rigidShape( shape, graphicsData=null, opts=null ) {

	var body;

	switch ( shape.type ) {

		case PIXI.SHAPES.POLY:
			body = Bodies.fromVertices( shape.x, shape.y, polyVerts(shape), opts );
			break;
		case PIXI.SHAPES.RECT:

			body = Bodies.rectangle( shape.x, shape.y, shape.width, shape.height, opts );
			break;

		case PIXI.SHAPES.CIRC:

			body = Bodies.circle( shape.x, shape.y, shape.radius, opts );
			break;

		case PIXI.SHAPES.ELIP:

			body = Bodies.fromVertices( shape.x, shape.y, ellipseVerts(shape), opts );
			break;

		case PIXI.SHAPES.RREC:
			// currently unsupported.
		default:
		console.log('unknown shape specified');
		return null;

	}

	return rigidObject( body, graphicsData ? createShape( shape, graphicsData) : null );

}

/**
 * Create a new GameObject with a RigidBody component.
 * @param {Material.Body|Object|null} [body=null] Body or body initialization object to use with the RigidBody component.
 * @param {DisplayObject|null} [clip=null] DisplayObject for the GameObject
 */
function rigidObject( body=null,clip=null ) {

	let g = new GameObject( clip );

	g.addExisting( new RigidBody(body) );

	return g;

}

/**
 * Create the vertices for an ellipse shape for a Matter Body.
 * x,y position of the shape is ignored since the vertices must be centered.
 * @param {PIXI.Ellipse} shape - the shape of the ellipse.
 * @returns {object[]} the array of vertex points.
 */
function ellipseVerts( shape, edges=12 ) {

	let theta = 2*Math.PI;
	let dtheta = theta / edges;

	let h = 0.5*shape.height;
	let w = 0.5*shape.width;

	let points = [];

	for( ; theta > 0; theta -= dtheta ){
		points.push( w*Math.cos(theta), h*Math.sin(theta ) );
	}

	return points;

}

/**
 * Get the Matter points making up a polygon.
 * @param {PIXI.Polygon} poly 
 */
function polyVerts( poly ) {

	// cant use the poly points directly since they have to be centered.
	let points = poly.points;
	let len = points.length;

	let cx = 0, cy = 0;
	let pt;

	let verts = [];

	for( let i = 0; i < len; i++ ) {

		pt = points[i];
		verts.push( { x:pt.x, y:pt.y} );

		cx += pt.x;
		cy += pt.y;

	}

	cx /= len;
	cy /= len;

	for( let i = 0; i < len; i++ ) {

		verts[i].x -= cx;
		verts[i].y -= cy;

	}

	return verts;

}


export { rigidObject, rigidShape };