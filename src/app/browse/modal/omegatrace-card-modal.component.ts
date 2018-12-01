import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

@Component({
    moduleId: module.id,
    templateUrl: "./omegatrace-card-modal.component.html",
    styleUrls: ["./omegatrace-card-modal.component.css"]
})
export class OmegaTraceCardModalComponent implements OnInit {
    cardId: any;
    cardUUID: any;
    cardName: any;
    constructor(private _params: ModalDialogParams, private _page: Page, private router: RouterExtensions,
                private _activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        // TODO:
        this.cardId = "Card ID:";
        this.cardUUID = "12345-2123123-123123";
        this.cardName = "nd344";
    }

    onAssociateButtonTap(): void {
        this.close();
    }

    close(): void {
        this._params.closeCallback("return value");
    }
}
