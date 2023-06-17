/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { TvConsole } from '../../../../core/utils/console';
import { ConditionUtils } from '../../builders/condition-utils';
import { ConditionType, Rule, TriggeringRule } from '../tv-enums';
import { AbstractByEntityCondition } from './abstract-by-entity-condition';

/**
 * Condition based on the headway time between a triggering entity/entities
 * and a reference entity. The logical operator used for comparison
 * is defined by the rule attribute.
 */
export class TimeHeadwayCondition extends AbstractByEntityCondition {

	conditionType = ConditionType.ByEntity_TimeHeadway;
	public name: string = 'TimeHeadwayCondition';

	/**
	 * @param targetEntity reference entity to which the time headway is computed
	 * @param value The time headway value. Unit: s; Range: [0..inf[.
	 * @param freespace True: time headway is measured using the distance between closest bounding box points.
	 * 					False: reference point distance is used.
	 * @param alongRoute True: routing is taken into account, e.g. turns will increase distance.
	 * 					False: straight line distance is used.
	 * @param rule The operator (less, greater, equal).
	 */
	constructor (
		public targetEntity: string,
		public value: number,
		public freespace: boolean,
		public alongRoute: boolean,
		public rule: Rule
	) {
		super();
	}

	hasPassed (): boolean {

		const isTimeHeadwaySatisfied = this.triggeringEntities.map( entityName => {

			const timeHeadway = this.computeTimeHeadway( entityName );

			// Check the time headway against the desired value based on the rule
			return ConditionUtils.hasRulePassed( this.rule, timeHeadway, this.value );

		} );

		// Check if condition is satisfied based on the triggering rule
		switch ( this.triggeringRule ) {

			case TriggeringRule.Any:
				// If any entity satisfies the condition, return true
				return this.passed = isTimeHeadwaySatisfied.some( condition => condition );

			case TriggeringRule.All:
				// If all entities satisfy the condition, return true
				return this.passed = isTimeHeadwaySatisfied.every( condition => condition );

			default:
				return false;
		}

	}

	private computeTimeHeadway ( entityName: string ): number {

		const entitySpeed = this.getEntitySpeed( entityName );
		const entityPosition = this.getEntityPosition( entityName );

		const targetEntitySpeed = this.getEntitySpeed( this.targetEntity );
		const targetEntityPosition = this.getEntityPosition( this.targetEntity );

		let distance: number;

		if ( !this.freespace ) {

			// Calculate the distance between the two entities
			distance = targetEntityPosition.distanceTo( entityPosition );

		} else {

			// TODO: Temporary implementation needs to be changed
			distance = targetEntityPosition.distanceTo( entityPosition );

			TvConsole.warn( 'Freespace For TimeHeadwayCondition Not Implemented' );

		}

		// Calculate the current time headway
		let headwayTime: number;

		if ( entitySpeed <= targetEntitySpeed ) {
			// If the entity is slower than or has the same speed as the target,
			// return a predefined constant indicating an invalid condition, such as Infinity.
			headwayTime = Infinity;
		} else {
			// Only calculate the time headway if the entity is faster than the target.
			headwayTime = distance / ( entitySpeed - targetEntitySpeed );
		}

		return headwayTime;
	}

	setTargetEntity ( $targetEntity: string ) {

		this.targetEntity = $targetEntity;

	}

	setRule ( rule: Rule ) {

		this.rule = rule;

	}
}
