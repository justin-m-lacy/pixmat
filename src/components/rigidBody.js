import {Component} from 'gibbon.js';
import * as Matter from 'matter-js';
import { Body, World, Constraint } from 'matter-js';

export default class RigidBody extends Component {

	/**
	 * {Matter.Body}
	 */
	get body() { return this._body; }
	set body(v) { this._body = v; }

	/**
	 * {Vector} Overrides GameObject position to help sync with the RigidBody position.
	 */
	get position() { return this._clip.position;}
	set position(v) {

		Body.setPosition( this._body, v );
		this._clip.position = v;

	}

	/**
	 * {boolean} Controls whether the body is static.
	 */
	get isStatic() { return this._body.isStatic;}
	set isStatic(v) { this._body.isStatic = v;}

	/**
	 * {boolean} [autoSync=true] If true, the underlying Body positions and rotations
	 * are automatically applied to the GameObject every frame.
	 * Default is true.
	 */
	get autoSync() { return this._autoSync; }
	set autoSync(v) {
		this._autoSync = v;
		if ( v) this._reverseSync = false;
	}

	/**
	 * {boolean} [reverseSync=false] If true, the GameObject's position is copied to the
	 * Material.Body position every frame.
	 * Setting this property to true will set autoSync to false.
	 */
	get reverseSync() { return this._reverseSync; }
	set reverseSync(v) {
		this._reverseSync = v;
		if ( v ) this._autoSync = false;
	}


	/**
	 * Create a new RigidBody Component.
	 * A Body can be supplied directly, or an options object for create a new Matter.Body.
	 * If the body parameter is null, a new Body object is created without options.
	 * @param {Matter.Body|Object} [body=null] 
	 */
	constructor( body=null ) {

		super();

		if ( !body ){
			this._body = Body.create();
		} else if ( body.type && body.type !== 'body' ) {
			this._body = Body.create(body);
		} else {
			this._body = body;
		}
	
		this._autoSync = true;

	}

	/**
	 * Create a joint between this body and another one.
	 * http://brm.io/matter-js/docs/classes/Constraint.html
	 * @param {Matter.Body|RigidBody} body 
	 * @param {number} [stiffness=1] stiffness of the constraint 
	 * @param {number} [damping=0] 0.1 is considered high.
	 * @param {number} dist - rest length between the bodies, or negative to use the current distance.
	 * @returns {Constraint} the Constraint created. 
	 */
	join( body, stiffness=1, damping=0, dist=-1 ) {

		if ( body instanceof RigidBody ) body = body.body;

		return Constraint.create({

			bodyA:this._body,
			bodyB:body,
			stiffness:stiffness,
			damping:damping,
			length:dist>=0 ? dist : null

		});

	}

	/**
	 * 
	 * @param {Matter.Body} body 
	 * @param {boolean} [autoHull=true] Whether to update the overall convex hull and centroid.
	 * @returns {RigidBody} this. 
	 */
	addBody( body, autoHull=true ) {
		Body.setParts( this._body, this._body.parts.join( body ), autoHull );
		return this;
	}

	init() {

		World.add( this.game.world, this._body );
		if ( this.clip ) this.clip.position.set( this._body.position.x, this._body.position.y );

	}

	update() {

		if ( !this._clip ) return;

		if ( this._autoSync === true ) this._clip.position.set( this._body.position.x, this._body.position.y );
		else if ( this._reverseSync === true ) {
			Body.setPosition( this._body, this._clip.position );
		}

		//console.log( this._clip.position.x + ', ' + this._clip.position.y);
	}

}