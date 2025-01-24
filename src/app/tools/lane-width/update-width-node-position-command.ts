/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { LineType, OdLaneReferenceLineBuilder } from 'app/modules/tv-map/builders/od-lane-reference-line-builder';
import { TvRoad } from 'app/modules/tv-map/models/tv-road.model';
import { Vector3 } from 'three';
import { LaneWidthNode } from '../../modules/three-js/objects/lane-width-node';
import { BaseCommand } from '../../commands/base-command';
import { NodeFactoryService } from '../../factories/node-factory.service';
import { MapEvents } from 'app/events/map-events';

export class UpdateWidthNodePositionCommand extends BaseCommand {

	constructor (
		private node: LaneWidthNode,
		private newPosition: Vector3,
		private oldPosition: Vector3,
		private laneHelper: OdLaneReferenceLineBuilder
	) {

		super();

	}

	execute (): void {

		NodeFactoryService.updateLaneWidthNode( this.node, this.newPosition );

		this.node.updateLaneWidthValues();

		this.rebuild( this.map.getRoadById( this.node.roadId ) );
	}

	undo (): void {

		NodeFactoryService.updateLaneWidthNode( this.node, this.oldPosition );

		this.node.updateLaneWidthValues();

		this.rebuild( this.map.getRoadById( this.node.roadId ) );

	}

	redo (): void {

		this.execute();

	}

	rebuild ( road: TvRoad ): void {

		MapEvents.laneUpdated.emit( this.node.lane );

		this.laneHelper.drawRoad( road, LineType.SOLID, true );

	}

}