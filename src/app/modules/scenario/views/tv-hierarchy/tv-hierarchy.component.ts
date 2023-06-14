/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AppInspector } from '../../../../core/inspector';
import { ContextMenuType, MenuService } from '../../../../services/menu.service';
import { ThreeService } from '../../../three-js/three.service';
import { EntityInspector } from '../../inspectors/tv-entity-inspector/tv-entity-inspector.component';
import { OpenScenario } from '../../models/tv-scenario';
import { DialogService } from '../../services/tv-dialog.service';
import { TvScenarioInstance } from '../../services/tv-scenario-instance';
import { Editor } from '../tv-editor/tv-editor';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface ScenarioNode {
	name: string;
	type?: NodeType;
	children?: ScenarioNode[];
}

/** Flat node with expandable and level information */
interface ExampleNode {
	expandable: boolean;
	name: string;
	level: number;
	type: NodeType;
}

enum NodeType {
	VEHICLE = 'vehicle',
	PEDESTRIAN = 'pedestrian',
	TRAFFIC_LIGHT = 'traffic_light',
	HEADER = 'header',
	ROAD_NETWORK = 'road_network'
}

@Component( {
	selector: 'app-tv-hierarchy',
	templateUrl: './tv-hierarchy.component.html',
} )
export class HierarchyComponent implements OnInit {


	@Input() scenario: OpenScenario;
	treeControl = new FlatTreeControl<ExampleNode>( node => node.level, node => node.expandable );
	dataSource: MatTreeFlatDataSource<ScenarioNode, { expandable: boolean; name: string; level: number; type: NodeType; }, { expandable: boolean; name: string; level: number; type: NodeType; }>;

	constructor (
		private dialogs: DialogService,
		private menuService: MenuService,
		private threeService: ThreeService
	) {
		this.dataSource = new MatTreeFlatDataSource( this.treeControl, this.treeFlattener );

		Editor.scenarioChanged.subscribe( () => {

			this.buildHierarchy();

		} );

	}

	transformer = ( node: ScenarioNode, level: number ) => {
		return {
			expandable: !!node.children && node.children.length > 0,
			name: node.name,
			level: level,
			type: node.type,
		};
	};

	treeFlattener = new MatTreeFlattener( this.transformer, node => node.level, node => node.expandable, node => node.children );

	hasChild = ( _: number, node: ExampleNode ) => node.expandable;

	ngOnInit () {

		this.buildHierarchy();

		this.registerContextMenu();

	}

	registerContextMenu (): any {

		this.menuService.registerContextMenu( ContextMenuType.HIERARCHY, [ {
			label: 'Add Vehicle',
			click: () => {
				this.dialogs.openAddVehicleDialog();
			}
		} ] );

	}

	buildHierarchy () {

		var data: ScenarioNode[] = [
			{
				name: 'Header',
				type: NodeType.HEADER
			},
			{
				name: 'Road Network',
				type: NodeType.ROAD_NETWORK
			}
		];

		var entityNode = {
			name: 'Entities',
			children: []
		};

		data.push( entityNode );

		this.scenario.objects.forEach( element => {

			entityNode.children.push( {
				name: element.name,
				type: NodeType.VEHICLE
			} );

		} );

		this.dataSource.data = data;

	}

	onClick ( node: ExampleNode ) {

		switch ( node.type ) {

			case NodeType.VEHICLE:
				this.openVehicleInspector( node );
				break;

			case NodeType.HEADER:
				this.openHeaderInspector( node );
				break;

			case NodeType.ROAD_NETWORK:
				this.openRoadNetworkDialog( node );
				break;

			default:
				break;
		}

	}

	onDoubleClick ( node: ExampleNode ) {

		switch ( node.type ) {

			case NodeType.VEHICLE:
				this.openVehicleInspector( node );
				break;

			case NodeType.HEADER:
				this.openHeaderInspector( node );
				break;

			case NodeType.ROAD_NETWORK:
				this.openRoadNetworkDialog( node );
				break;

			default:
				break;
		}

	}

	openRoadNetworkDialog ( node: ExampleNode ) {

		this.dialogs.openEditRoadNetworkDialog( null );

	}

	openHeaderInspector ( node: ExampleNode ) {


	}

	openVehicleInspector ( node: ExampleNode ) {


		var object = TvScenarioInstance.openScenario.objects.get( node.name );

		// SceneService.select( object.gameObject );
		// SceneService.focus( object.gameObject );

		// Editor.selectedEntityChanged.emit( object );

		this.threeService.focus( object.gameObject );

		AppInspector.setInspector( EntityInspector, object );

	}

	showContextMenu ( $event: MouseEvent ) {

		$event.preventDefault();

		this.menuService.showContextMenu( ContextMenuType.HIERARCHY );

	}
}