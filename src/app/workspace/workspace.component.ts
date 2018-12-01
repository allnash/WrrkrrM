import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { getRootView } from "tns-core-modules/application";
import { alert } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { User } from "../shared/user/user.model";
import { UserService } from "../shared/user/user.service";

@Component({
    selector: "ns-workspace",
    providers: [UserService],
    templateUrl: "./workspace.component.html",
    styleUrls: ["./workspace.component.css"],
    moduleId: module.id
})
export class WorkspaceComponent implements OnInit, AfterViewInit {
    drawer: RadSideDrawer;
    workspaceName: string;
    isLoading = true;

    // instantiate the plugin
    constructor(private router: Router, private routerExtensions: RouterExtensions,
                private userService: UserService, private page: Page) {
    }

    submit() {
        console.debug("ww" + this.workspaceName);
        this.userService.verifyWorkspace(this.workspaceName)
            .subscribe((result) => {
                console.debug(JSON.stringify(result));
                if (result["status"] == "ok") {
                    this.routerExtensions.navigate(["/login"]);
                    User.workspaceName = this.workspaceName;
                    User.doSetAllSync();
                } else {
                    alert("Unfortunately we could verify your account workspace.");
                }
            }, (error) => {
                console.log(error);
                alert({
                    title: "Invalid entry",
                    message: "Please enter a valid workspace name.",
                    okButtonText: "Ok"
                }).then(() => {
                    console.log("The user closed the alert.");
                });
            });
    }

    signUpPage() {
        this.router.navigate(["/signup"]);
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        // sync
        User.getAllSecureValues();
        if (!User.sessionId) {
            console.log("Not authenticated.");
            this.isLoading = false;
            return;
        } else {
            this.routerExtensions.navigate(["/home"], {clearHistory: true});
            console.log("Authentication expired.");
            this.isLoading = false;
            return;

        }
    }

    ngAfterViewInit() {
        // use setTimeout otherwise there is no getRootView valid reference
        setTimeout(() => {
            this.drawer = <RadSideDrawer>getRootView();
            this.drawer.gesturesEnabled = false;
        }, 100);
    }
}
