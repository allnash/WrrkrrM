import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import { SecureStorage } from "nativescript-secure-storage";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { getRootView } from "tns-core-modules/application";
import { alert } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { User } from "../shared/user/user.model";
import { UserService } from "../shared/user/user.service";

@Component({
    selector: "ns-login",
    providers: [UserService],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
    moduleId: module.id
})
export class LoginComponent implements OnInit, AfterViewInit {
    drawer: RadSideDrawer;
    workspaceName;
    email: string;
    password: string;
    isLoggingIn = true;
    isLoading = true;
    secureStorage = new SecureStorage();

    // instantiate the plugin

    constructor(private router: Router, private routerExtensions: RouterExtensions,
                private userService: UserService, private page: Page) {
        this.workspaceName = User.workspaceName;
        console.debug("workspace name:" + this.workspaceName);
    }

    submit() {
        this.login();
    }

    login() {
        this.userService.login(this.email, this.password)
            .subscribe((result) => {
                console.debug(JSON.stringify(result));
                if (result["status"] === "ok") {
                    this.routerExtensions.navigate(["/home"], {clearHistory: true});
                    User.workspaceName = this.workspaceName;
                    User.email = this.email;
                    User.firstName = result["user"]["first_name"];
                    User.lastName = result["user"]["last_name"];
                    User.sessionId = result["session"]["id"];
                    User.id = result["user"]["id"];
                    User.profileImageUrl = result["user"]["image"]["url"];
                    User.doSetAllSync();
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
                    message: "Unfortunately we could not find your account.",
                    okButtonText: "Ok"
                }).then(() => {
                    console.log("The user closed the alert.");
                });
            });
    }

    workspacePage() {
        User.doRemoveAllSync();
        this.routerExtensions.backToPreviousPage();
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        // sync
        const currentUser: User = this.secureStorage.getSync({
            key: "wrrkrr.user"
        });
        if (!currentUser) {
            console.log("Not authenticated.");
            this.isLoading = false;

            return;
        } else {
            if (User.sessionId) {
                console.log("Authenticated.");
                this.routerExtensions.navigate(["/items"], {clearHistory: true});
            } else {
                console.log("Authentication expired.");
                this.isLoading = false;

                return;
            }
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
