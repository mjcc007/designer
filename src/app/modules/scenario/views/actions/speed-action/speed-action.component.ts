/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Component, Input, OnInit } from '@angular/core';
import { IComponent } from 'app/core/game-object';
import { AbstractPrivateAction } from '../../../models/abstract-private-action';
import { SpeedAction } from '../../../models/actions/tv-speed-action';
import { AbstractTarget } from 'app/modules/scenario/models/actions/abstract-target';

@Component( {
	selector: 'app-speed-action',
	templateUrl: './speed-action.component.html',
	styleUrls: [ './speed-action.component.css' ]
} )
export class SpeedActionComponent implements OnInit, IComponent {

	data: SpeedAction;

	@Input() action: AbstractPrivateAction;

	get speedAction () {
		return this.action as SpeedAction;
	}

	ngOnInit () {

		if ( this.data != null && this.action == null ) {

			this.action = this.data;

		}
	}

	onTargetChanged ( value: AbstractTarget ) {

		this.speedAction.target = value;

	}

}
