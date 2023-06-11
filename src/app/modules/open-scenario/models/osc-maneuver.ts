/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { EventEmitter } from '@angular/core';
import { StoryEvent } from '../services/scenario-player.service';
import { TvScenarioInstance } from '../services/tv-scenario-instance';
import { StoryElementType } from './osc-enums';
import { Event } from './osc-event';
import { AbstractAction } from './osc-interfaces';
import { ParameterDeclaration } from './osc-parameter-declaration';

export class Maneuver {

	private static count = 1;

	public parameterDeclaration: ParameterDeclaration;

	public events: Event[] = [];

	public hasStarted: boolean;
	public isCompleted: boolean;
	public eventIndex: number = 0;

	public completed = new EventEmitter<StoryEvent>();

	constructor ( public name: string ) {

		Maneuver.count++;

	}

	static getNewName ( name = 'MyManeuver' ) {

		return `${ name }${ this.count }`;

	}

	addNewEvent ( name: string, priority: string ) {

		const hasName = TvScenarioInstance.db.has_event( name );

		if ( hasName ) throw new Error( 'Event name already used' );

		const event = new Event( name, priority );

		this.addEventInstance( event );

		return event;
	}

	addEventInstance ( event: Event ) {

		this.events.push( event );

		TvScenarioInstance.db.add_event( event.name, event );

		event.completed.subscribe( e => {
			this.onEventCompleted( e );
		} );

		return event;

	}

	private onEventCompleted ( storyEvent: StoryEvent ) {

		this.eventIndex++;

		let allCompleted = true;

		for ( const event of this.events ) {

			if ( !event.isCompleted ) {

				allCompleted = false;

				break;

			}
		}

		if ( allCompleted ) {

			this.isCompleted = true;

			this.completed.emit( {
				name: this.name,
				type: StoryElementType.maneuver
			} );

		}
	}
}

export class EventAction {

	public name: string;
	public action: AbstractAction;

}
