/*
 * Copyright Truesense AI Solutions Pvt Ltd, All Rights Reserved.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChooseConditionDialogComponent } from '../../dialogs/choose-condition-dialog/choose-condition-dialog.component';
import { AbstractCondition } from '../../models/conditions/osc-condition';
import { Act } from '../../models/osc-act';
import { EntityObject } from '../../models/osc-entities';
import { TvScenarioInstance } from '../../services/tv-scenario-instance';

@Component( {
	selector: 'app-osc-act-editor',
	templateUrl: './osc-act-editor.component.html',
	styleUrls: [ './osc-act-editor.component.css' ]
} )
export class ActEditorComponent implements OnInit {

	acts: Act[] = [];
	selectedAct: Act;

	constructor (
		public dialogRef: MatDialogRef<ActEditorComponent>,
		@Inject( MAT_DIALOG_DATA ) public data: EntityObject,
		private dialog: MatDialog
	) {

	}

	get entity () {
		return this.data;
	}

	get scenario () {
		return TvScenarioInstance.openScenario;
	}

	ngOnInit () {

		this.acts = this.scenario.getActsByOwner( this.entity.name );
		this.selectedAct = this.acts[ 0 ];

	}

	addCondition () {

		const dialogRef = this.dialog.open( ChooseConditionDialogComponent, {
			width: '260px',
			height: '400px',
			data: null
		} );

		dialogRef.afterClosed().subscribe( ( res: AbstractCondition ) => {

			if ( res != null ) this.selectedAct.addStartCondition( res );

		} );
	}

}
