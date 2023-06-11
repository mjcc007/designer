/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { AfterTerminationRule, ConditionType, StoryElementType } from '../osc-enums';
import { AbstractByStateCondition } from './osc-condition';

export class AfterTerminationCondition extends AbstractByStateCondition {

	public readonly conditionType = ConditionType.ByState_AfterTermination;

	constructor (
		public elementName: string,
		public type: StoryElementType,
		public rule: AfterTerminationRule
	) {

		super();

	}

	hasPassed (): boolean {
		return false;
	}

}
