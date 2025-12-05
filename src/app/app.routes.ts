import { Routes } from '@angular/router';

export const routes: Routes = [

        {
        path: 'pixeltrack',
        loadChildren: () => import('./pixeltrack/pixeltrack.routes').then(m => m.pixelTrackRoutes)
    },
    {
        path: '',
        redirectTo: 'pixeltrack',
        pathMatch: 'full'
    }

];
