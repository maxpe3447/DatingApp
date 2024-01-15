import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './_resolves/member-detailed.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'messages', component: MessagesComponent },
            { path: 'members', component: MemberListComponent },
            { path: 'members/:username', component: MemberDetailComponent, resolve: {member: memberDetailedResolver}},
            { path: 'member/edit', component: MemberEditComponent, canDeactivate:[preventUnsavedChangesGuard] },
            { path: 'lists', component: ListComponent },
            { path: 'admin', component: AdminPanelComponent },
        ]
    },
    { path: 'errors', component: TestErrorComponent},
    { path: 'not-found', component: NotFoundComponent},
    { path: 'server-error', component: ServerErrorComponent},
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }

];
