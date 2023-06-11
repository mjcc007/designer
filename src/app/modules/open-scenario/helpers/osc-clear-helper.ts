import { OpenScenario } from '../models/osc-scenario';
import { SceneService } from '../../../core/services/scene.service';

export class OscClearHelper {

    constructor () {

    }

    clear ( openScenario: OpenScenario ) {

        if ( openScenario == null ) return;

        openScenario.objects.forEach( entity => {

            SceneService.remove( entity.gameObject );

            entity.initActions.splice( 0, entity.initActions.length );

        } );

        openScenario.storyboard.stories.forEach( story => {

            story.acts.splice( 0, story.acts.length );

        } );

        openScenario.storyboard.stories.clear();

    }

}