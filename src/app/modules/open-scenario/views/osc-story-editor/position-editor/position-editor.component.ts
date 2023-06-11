import { Component, OnInit } from '@angular/core';
import { AbstractPosition } from '../../../models/osc-interfaces';
import { OscPositionType } from 'app/modules/open-scenario/models/osc-enums';
import { OscWorldPosition } from '../../../models/positions/osc-world-position';
import { OscLanePosition } from '../../../models/positions/osc-lane-position';
import { OscRelativeObjectPosition } from '../../../models/positions/osc-relative-object-position';
import { AbstractPositionEditor } from './AbstractPositionEditor';

@Component( {
    selector: 'app-position-editor',
    templateUrl: './position-editor.component.html'
} )
export class PositionEditorComponent extends AbstractPositionEditor implements OnInit {

    get types () {
        return OscPositionType;
    }

    constructor () {
        super();
    }

    ngOnInit () {


    }

    onChange ( e: number ) {

        switch ( e ) {

            case this.types.World:
                this.position = new OscWorldPosition();
                break;

            // case this.types.Road:
            //     this.position = new OscRoadPosition();
            //     break;

            case this.types.Lane:
                this.position = new OscLanePosition();
                break;

            case this.types.RelativeObject:
                this.position = new OscRelativeObjectPosition();
                break;

            default:
                break;

        }


        this.positionChanged.emit( this.position );

    }

    onPositionModified ( $event: AbstractPosition ) {

        this.positionModified.emit( $event );

    }
}