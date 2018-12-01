import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { BrowseRoutingModule } from "./browse-routing.module";
import { BrowseComponent } from "./browse.component";

import { OmegaTraceCardModalComponent } from "./modal/omegatrace-card-modal.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        BrowseRoutingModule
    ],
    declarations: [
        BrowseComponent,
        OmegaTraceCardModalComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        OmegaTraceCardModalComponent
    ]
})
export class BrowseModule {
}
