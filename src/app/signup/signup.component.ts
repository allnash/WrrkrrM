import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import { SecureStorage } from "nativescript-secure-storage";
import { alert } from "tns-core-modules/ui/dialogs";
import { NavigationTransition } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { User } from "../shared/user/user.model";
import { UserService } from "../shared/user/user.service";

@Component({
    selector: "ns-login",
    providers: [UserService],
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"],
    moduleId: module.id,
})
export class SignupComponent implements OnInit {
    user: User;
    isLoggingIn = true;
    isLoading = true;
    secureStorage = new SecureStorage();

    // instantiate the plugin

    constructor(private router: Router, private routerExtensions: RouterExtensions,
                private userService: UserService, private page: Page) {
        this.user = new User();
    }

    submit() {
        this.signUp();
    }

    signUp() {
        this.userService.register()
            .subscribe((result) => {
                let data = (<any>result).json.data;
                this.routerExtensions.navigate(["/items"], {clearHistory: true});
            }, (error) => {
                console.log(error);
                alert("Unfortunately we could not find your account.");
            });
    }

    workspacePage() {
        this.routerExtensions.backToPreviousPage();
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        // sync
        var currentUser: User = this.secureStorage.getSync({
            key: "wrrkrr.user"
        });
        if (!currentUser) {
            console.log("Not authenticated.");
            this.isLoading = false;
            return;
        } else {
            if (currentUser) {
                console.log("Authenticated.");
                this.routerExtensions.navigate(["/items"], {clearHistory: true});
            } else {
                console.log("Authentication expired.");
                this.isLoading = false;
                return;
            }
        }
    }
}
