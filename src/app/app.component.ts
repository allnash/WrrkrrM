import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { requestPermission } from "nativescript-permissions";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as appSettings from "tns-core-modules/application-settings";
import { isAndroid } from "tns-core-modules/platform";
import { User } from "~/app/shared/user/user.model";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, AfterViewInit {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string;

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    @ViewChild(RadSideDrawerComponent)
    drawerComponent: RadSideDrawerComponent;
    isUserLogged: boolean = false;
    isLoading: boolean = false;
    private _activatedUrl: string;
    private _drawer: RadSideDrawer;
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(
        private router: Router, private routerExtensions: RouterExtensions,
        private _changeDetectionRef: ChangeDetectorRef,
        private _routerExtensions: RouterExtensions
    ) {
        if (isAndroid) {
            requestPermission(
                [
                    "android.permission.INTERNET",
                    "android.permission.READ_EXTERNAL_STORAGE",
                    "android.permission.WRITE_EXTERNAL_STORAGE",
                    "android.permission.SET_WALLPAPER",
                    "android.permission.ACCESS_NETWORK_STATE"
                ],
                "I need these permissions"
            )
                .then((res) => {
                    console.log("Permissions granted!");
                })
                .catch((err) => {
                    console.log("No permissions!");
                });
        }
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();
        // Load User
        User.getAllSecureValues();
        this.firstName = User.firstName === undefined ? "User" : User.firstName;
        this.lastName = User.lastName === undefined ? "Name" : User.lastName;
        this.email = User.email === undefined ? "username@exampole.com" : User.email;
        // Send to login if not authenticated
        if (!User.sessionId) {
            console.log("Not authenticated.");
            this.routerExtensions.navigate(["/workspace"], {clearHistory: true});
            return;
        }

        console.debug("fn:" + User.firstName + " ln:" + User.lastName + " email:" + User.email + " img:" +
            User.profileImageUrl);

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    ngAfterViewInit() {
        this._drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
}
