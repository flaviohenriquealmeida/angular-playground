import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoListComponent } from './photo-list/photo-list.component';
import { PhotoListResolver } from './photo-list/photo-list.resolver';
import { PhotoFormComponent } from './photo-form/photo-form.component';
import { AuthGuard } from '../core/services/auth/auth.guard';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import { PhotoDetailsResolver } from './photo-details/photo-details.resolver';

const routes: Routes = [
    {
        path: 'user/:userName',
        component: PhotoListComponent,
        resolve: {
            photos: PhotoListResolver
        },
        data: {
            title: 'Timeline'
        }
    },
    {
        path: 'p/add',
        component: PhotoFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Photo upload'
        }
    },
    {
        path: 'p/:photoId',
        component: PhotoDetailsComponent,
        data: {
            title: 'Photo detail'
        },
        resolve: {
          photo: PhotoDetailsResolver
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [ RouterModule ]
})
export class PhotosRoutingModule { }

