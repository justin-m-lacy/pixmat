import * as Gibbon from 'gibbon.js';
import * as Matter from 'matter-js';
import * as PIXI from 'pixi.js';
import { Bodies, World } from 'matter-js';

export default class PhysicsGame extends Gibbon.Game {

	/**
	 * {Matter.Engine} the matter-js engine. Called 'physics' to distinguish it
	 * from the default gibbon 'engine'
	 */
	get physics() { return this._physics; }
	set physics(v) { this._physics =v; }

	/**
	 * {Body[]||null} bounding walls, if set.
	 */
	get bounds() { return this._bounds; }

	/**
	 * {Body} top wall, if any.
	 */
	get top() { return this._top; }

	/**
	 * {Body} bottom wall, if any.
	 */
	get bottom() { return this._bottom; }

	/**
	 * {Body} left wall, if any
	 */
	get left() { return this._left; }

	/**
	 * {Body} right wall, if any.
	 */
	get right() { return this._right;}


	/**
	 * {Matter.World} The world containing the matter objects.
	 */
	get world() { return this._world; }
	set world(v) { this._world = v;}

	get gravity() { return this._world.gravity; }
	set gravity(v) { this._world.gravity = v;}

	get ground() { return this._ground; }
	set ground(v) { this._ground = v; }

	/**
	 * 
	 * @param {PIXI.Application} app
	 * @param {Object} [opts=null]
	 * @param {number?} opts.ground - ground y.
	 * @param {boolean?} opts.autoWalls - create bounding walls to the app screen size.
	 */
	constructor( app, opts=null ){

		super(app);

		this._physics = Matter.Engine.create();

		this._world = this._physics.world;
		this._world.bounds.max.y = this._screen.height;

		//console.log('grav: ' + this._world.gravity );
		this._bodies = Matter.Bodies;

		if ( opts.ground ) this.makeGround( opts.ground );
		if ( opts.autoWalls )this.setBounds( this._screen );

	}

	/**
	 * Create bounding rectangles for the world.
	 * @param {PIXI.Rectangle} bounds
	 * @param {number} [thickness=16]
	 * @param {Body[]} Array of bounding walls.
	 */
	setBounds( bounds, thickness=16 ) {

		let opts = { isStatic:true };

		this._left = Bodies.rectangle( bounds.x - thickness, bounds.y, thickness, bounds.height, opts );
		this._right = Bodies.rectangle( bounds.right, bounds.y, thickness, bounds.height, opts );
		this._top = Bodies.rectangle( bounds.x, bounds.y-thickness, bounds.width, thickness, opts );
		this._bottom = Bodies.rectangle( bounds.x, bounds.bottom, bounds.width, thickness, opts );

		this._bounds = [
			this._left, this._right, this._top, this._bottom
		];

		World.add( this._world, this._bounds );

		return this._bounds;

	}

	/**
	 * 
	 * @param {number} groundY 
	 * @param {number} thickness
	 * @returns {Body} The ground body.
	 */
	makeGround( groundY, thickness=16 ) {

		let ground = Bodies.rectangle( this._screen.x - thickness, groundY, this._screen.width + 2*thickness, thickness, {

			isStatic:true
		});

		World.add( this._world, ground );

		return ground;

	}

	init() {
		super.init();
	}

	start(){
		
		this.ticker.add( this.update, this );
		super.start();

	}

	update(delta ){

		let ms = this._ticker.elapsedMS;
		Matter.Engine.update( this._physics, ms );

	}

}