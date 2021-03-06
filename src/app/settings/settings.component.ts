import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { alert } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { User } from "~/app/shared/user/user.model";
import { UserService } from "~/app/shared/user/user.service";

@Component({
    selector: "Settings",
    providers: [UserService],
    moduleId: module.id,
    templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit {

    private workspaceName: string;

    constructor(private router: Router, private routerExtensions: RouterExtensions,
                private userService: UserService, private page: Page) {
        this.workspaceName = User.workspaceName;
        console.debug("workspace name:" + this.workspaceName);
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    doLogout(): void {
        this.userService.logout(User.sessionId)
            .subscribe((result) => {
                console.debug(JSON.stringify(result))
                if (result["status"] === "ok") {
                    this.routerExtensions.navigate(["/workspace"], {clearHistory: true});
                    User.doRemoveAllSync();
                } else {
                    alert({
                        title: "Invalid entry",
                        message: result["error"]["error"],
                        okButtonText: "Ok"
                    }).then(() => {
                        console.log("The user closed the alert.");
                    });
                }
            }, (error) => {
                console.log(error);
                alert({
                    title: "Invalid entry",
                    message: "Unfortunately we could not log out from your account.",
                    okButtonText: "Ok"
                }).then(() => {
                    console.log("The user closed the alert.");
                });
            });
    }
}
