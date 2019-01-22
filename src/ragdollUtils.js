import RigidBody from './components/rigidBody';
import * as Matter from 'matter-js';
import { Point } from 'pixi.js';
import RagDoll from './components/ragdoll';

const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Vector = Matter.Vector;

export function makeGosling() {

	let head = Bodies.circle( -40, -80, 20 );
	let body = ellipseBody(  40, 80 );

	let leftWing = ellipseBody( 20, 40 );
	let rightWing = ellipseBody( 20, 40 );
	let leftLeg = ellipseBody(10, 30);
	let rightLeg = ellipseBody(10, 30);

	let r = new RagDoll([

			head,
			body,
			leftWing,
			rightWing,
			leftLeg,
			rightLeg
		],
		[

		]);

		return r;

}


/**
 * 
 * @param {Number} a - radius of the ellipse on the x-axis. 
 * @param {Number} b - y-radius of the ellipse.
 */
function ellipseBody( a, b ) {

	let vertices = ellipsePoints( a, b, 20 );

	return Body.create( {

		vertices:vertices

	});

}

/**
 * NOTE: vertices must be clockwise for use in Matter Bodies.
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} vertices - number of points on the ellipse.
 */
function ellipsePoints( a, b, vertices=20 ) {

	if ( vertices < 2 ) return null;

	let points = [];
	let dtheta = 2*Math.PI/vertices;

	for( let theta = 2*Math.PI; theta > 0; theta -= dtheta ) {

		var x = a*Math.cos(theta);
		var y = b*Math.sin(theta);

		points.push( new Vector(x,y) );

	}

	return points;

}

/**
 * 
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} numPoints - number of points on the ellipse.
 */
/*
This was stupid...
function ellipsePoints( a, b, numPoints=10 ) {

	if ( numPoints < 2 ) return null;

	let points = [];
	let y, x = -a;
	let dx = 2*a/(numPoints-1);
	let a2 = a*a;

	for( let i = 0; i < numPoints; i++ ) {

		x += dx;
		y = b*Math.sqrt( 1 - (x*x)/a2 );

		points.push( new Point(x,y) );
		if ( y > 0 ) points.unshift( new Point(x, -y) );

	}

	return points;

}*/