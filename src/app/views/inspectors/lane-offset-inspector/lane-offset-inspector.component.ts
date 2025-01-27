/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Component, OnDestroy } from '@angular/core';
import { BaseInspector } from 'app/core/components/base-inspector.component';
import { IComponent } from 'app/core/game-object';
import { UpdateLaneOffsetDistanceCommand } from 'app/tools/lane-offset/update-lane-offset-distance-command';
import { UpdateLaneOffsetValueCommand } from 'app/tools/lane-offset/update-lane-offset-value-command';
import { OdLaneReferenceLineBuilder } from 'app/modules/tv-map/builders/od-lane-reference-line-builder';
import { TvRoadLaneOffset } from 'app/modules/tv-map/models/tv-road-lane-offset';
import { CommandHistory } from 'app/services/command-history';

@Component( {
	selector: 'app-lane-offset-inspector',
	templateUrl: './lane-offset-inspector.component.html'
} )
export class LaneOffsetInspector extends BaseInspector implements IComponent, OnDestroy {

	public data: TvRoadLaneOffset;

	public laneHelper = new OdLaneReferenceLineBuilder();

	constructor () {

		super();

	}

	ngOnDestroy (): void {

		this.laneHelper.clear();

	}

	onDistanceChanged ( $value: number ) {

		CommandHistory.execute( new UpdateLaneOffsetDistanceCommand( this.data.node, $value, null, this.laneHelper ) );

	}

	onOffsetChanged ( $value ) {

		CommandHistory.execute( new UpdateLaneOffsetValueCommand( this.data.node, $value, null, this.laneHelper ) );

	}

	onDelete (): void {

		// TODO: implement method

	}

}
