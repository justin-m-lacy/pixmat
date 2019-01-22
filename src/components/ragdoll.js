import { Component } from "gibbon.js";
import * as Matter from 'matter-js';
import { Container, Graphics } from "pixi.js";
import {createShape, createPoly } from 'gibbon.js/utils/drawUtils';

const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Constraint = Matter.Constraint;

/**
 * RagDoll represents an object composed of many subparts, each with its own DisplayObject.
 */
export default class RagDoll extends Component {

	/**
	 * Object{string|number->Body} Composite parts indexed by name.
	 * NOTE: there is no indication that Matter.Composite.get() is efficient.
	 */
	get parts() { return this._parts;}
	set parts(v) { this._parts = v; }

	/**
	 * {Object{string->DisplayObject}} clips composing the Body parts.
	 */
	get clips() { return this._clips; }
	set clips(v) { this._clip = v; }

	/**
	 * {Composite} The matter.js composite holding all the parts.
	 */
	get composite() { return this._composite; }

	/**
	 * 
	 * @param {Body[]} [bodies=null] - bodies that make up the Composite. 
	 * @param {DisplayObject} [clips=null] DisplayObjects associated with the body parts. 
	 * @param {Object[]|null} constraints 
	 */
	constructor( bodies=null, clips={}, constraints=null ){

		super();

		this._composite = Composite.create({

				bodies,
				constraints

		});

		// clips indexed by name.
		this._clips = clips || {};

		// bodies indexed by name.
		this._parts = {};

		let body;
		for( let i = bodies.length-1; i >= 0; i-- ) {
		
			body = bodies[i];
			if ( !body.label ) body.label = this.uniqueLabel();
			this._parts[body.label] = body;

		}


	}
	
	init(){

		World.addBody( this.game.world, this._composite );
	}

	/**
	 * Set all clips to match the locations of their corresponding body parts.
	 */
	update() {

		let bodies = this._composite.bodies;
		let clip;
		let body;
		for( let i = bodies.length-1; i >= 0; i-- ) {

			body = bodies[i];
			clip = this._clips[ body.label ];
			if ( clip === undefined || clip === null ) continue;

			// Might need to transform from world to local space...
			clip.rotation = body.angle;
			clip.position.set( body.position.x, body.position.y );

		}

	}

	/**
	 * Create a Container with the graphics for each part.
	 * parts with a 
	 * @param {Object{string->*}} partSkins - skinning information for each part.
	 * @returns {Object} DisplayObjects indexed by part label.
	 */
	makeGraphics( partSkins ) {

		let parent = this.clip;

		// graphics by key
		let clips = {};

		let clip;
		for( let k in this._parts ) {

			clip = this.drawPart( this._parts[k], partSkins[k] );
			if ( clip === null ) continue;
			parent.addChild( clip );
			clips[k] = clip;

		}

		return clips;

	}

	/**
	 * Draw a body part.
	 * @param {*} body 
	 * @param {*} skin - skinning information for the part.
	 * @returns {DisplayObject} the DisplayObject created.
	 */
	drawPart( body, skin) {

		// NOTE: body vertices already translated by this time?
		// TODO: retranslate vertices.
		if ( !body || !skin) return null;

		let g = new Graphics();
		if ( skin.lineColor ) g.lineStyle( skin.lineWidth||1, skin.lineColor );
		if ( skin.fillColor ) g.beginFill( skin.fillColor, skin.fillAlpha || 1 );

		g.drawPolygon( body.vertices );

		if ( skin.fillColor) g.endFill();

		return g;

	}

	/**
	 * Create a constraint to join two parts of the ragdoll.
	 * @param {string} part1 - name or id of the first part to join.
	 * @param {string|Body} part2 - name or id of second part to join.
	 * @param {Object} [opts=null] - constraint options.
	 * @returns {Constraint} the created constraint, or null if one of the parts
	 * could not be found.
	 */
	join( part1, part2, opts=null ) {

		let p1 = this._parts[part1];
		let p2 = typeof(part2) === 'string' ? this._parts[part2] : part2;

		if ( !p1 || !p2) return null;
		opts = opts || {};

		if ( !opts.render ) opts.render = {visible:false};
		if ( !opts.stiffness ) opts.stiffness = 0.5;


		opts.bodyA = p1;
		opts.bodyB = p2;

		let c = Constraint.create( opts );

		return c;

	}

	/**
	 * Create a label that can be used as a part label, unique among existing parts.
	 * @param {string} prefix - prefix to use as the start of the label. if not unique,
	 * a unique number will be appended to the part name.
	 * @returns {string} the unique label that can be used.
	 */
	uniqueLabel( prefix='part'){

		let count = 0;
		while ( this._parts.hasOwnProperty(prefix+count) ) {
			count++;
		}

		return prefix+count;

	}

	/**
	 * Get a body part associated with a key.
	 * @param {string} key - key of the body part to get.
	 * @returns {Body} The body part associated with a key. 
	 */
	getPart( key ) {
		return this._parts[key];
	}

	/**
	 * Add a part to the ragdoll, assign the given key to its label, and associate
	 * the part with the given key.
	 * If no key is supplied, the part label is used.
	 * If no label exists, a new one is created.
	 * @param {*} part 
	 * @param {string|null} [key=null] key to associate with the part.
	 * @returns {RagDoll} this object, for chaining.
	 */
	addPart( part, key=null ) {

		key = key || part.label || this.uniqueLabel();
		part.label = key;

		this._parts[key] = part;

		return this;

	}

}