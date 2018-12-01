import { Component, OnInit, ViewContainerRef } from "@angular/core";
import * as applicationModule from "application";
import { Bluetooth, Peripheral } from "nativescript-akylas-bluetooth";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular/modal-dialog";
import {
    NativescriptIbeacon
} from "nativescript-ibeacon";
import {
    Beacon,
    BeaconCallback,
    BeaconLocationOptions, BeaconLocationOptionsAndroidAuthType, BeaconLocationOptionsIOSAuthType,
    BeaconRegion
} from "nativescript-ibeacon/nativescript-ibeacon.common";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Observable } from "rxjs";
import * as app from "tns-core-modules/application";
import { Color } from "tns-core-modules/color";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { isIOS } from "tns-core-modules/platform";
import { OmegaTraceCardModalComponent } from "~/app/browse/modal/omegatrace-card-modal.component";

declare var UITableViewCellSelectionStyle;

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})

// @ts-ignore
export class BrowseComponent extends Observable implements OnInit, BeaconCallback {
    isLoading: boolean;
    peripherals = new ObservableArray();
    message: string = "Init";
    private _bluetooth = new Bluetooth();
    private nativescriptIbeacon: NativescriptIbeacon;
    private region: BeaconRegion = null;

    constructor(private modalService: ModalDialogService, private viewContainerRef: ViewContainerRef) {
        super();
        // initialize
        this.isLoading = false;
        // enables the console.logs from the Bluetooth source code
        this._bluetooth.debug = true;
        console.log("enabled", this._bluetooth.enabled);

        // using an event listener instead of the 'onDiscovered' callback of 'startScanning'
        this._bluetooth.on(Bluetooth.device_discovered_event, (eventData: any) => {
            console.log("Peripheral found: " + JSON.stringify(eventData.data));
            this.peripherals.push(<Peripheral>eventData.data);
        });

        const options: BeaconLocationOptions = {
            iOSAuthorisationType: BeaconLocationOptionsIOSAuthType.Always,
            androidAuthorisationType: BeaconLocationOptionsAndroidAuthType.Coarse,
            androidAuthorisationDescription: "Location permission needed"
        };
        this.nativescriptIbeacon = new NativescriptIbeacon(this, options);

        this.region = new BeaconRegion("OmegaTrace Card", "FDAD6310-F4CA-11E8-B568-0800200C9A66");
    }

    ngOnInit(): void {
        if (applicationModule.ios) {
            // this.myRadListView.ios.pullToRefreshView.backgroundColor = (new Color("#000000")).ios;
        }
    }

    onItemLoading(args) {
        if (isIOS) {
            const iosCell = args.ios;
            iosCell.selectionStyle = UITableViewCellSelectionStyle.None;
        }
    }

    doEnableBluetooth() {
        this._bluetooth.enable().then((enabled) => {
            setTimeout(() => {
                setTimeout(() => {
                    alert({
                        title: "Please enable Bluetooth on your phone for scanning.",
                        message: enabled ? "Yes" : "No",
                        okButtonText: "OK, nice!"
                    });
                }, 500);
            });
        });
    }

    doIsEnableBluetooth(): void {
        this._bluetooth.isBluetoothEnabled().then((enabled) => {
            setTimeout(() => {
                alert({
                    title: "Bluetooth enabled?",
                    message: enabled ? "Yes" : "No",
                    okButtonText: "OK"
                });
            }, 500);
        });
    }

    doStartScanningOmegaTraceReaders(): void {
        this.isLoading = true;
        this.peripherals.splice(0, this.peripherals.length);
        this._bluetooth.startScanning({
            // beware: the peripheral must advertise ALL these services
            filters: [{serviceUUID: "ec00"}],
            seconds: 10,
            onDiscovered: (peripheral) => {
                this.peripherals.push(peripheral);
            },
            skipPermissionCheck: true
            // we can skip permissions as we use filters:
            // https://developer.android.com/guide/topics/connectivity/bluetooth-le
        }).then(() => {
                this.isLoading = false;
            },
            (err) => {
                this.isLoading = false;
                alert({
                    title: "Unable to scan.",
                    message: err,
                    okButtonText: "OK, got it"
                });
            });
    }

    doStartScanningOmegaTraceCards(): void {
        this.isLoading = true;
        this.peripherals.splice(0, this.peripherals.length);
        if (!this.nativescriptIbeacon.isAuthorised()) {
            console.log("NOT Authorised");
            this.nativescriptIbeacon.requestAuthorization()
                .then(() => {
                    console.log("Authorised by the user");
                    this.nativescriptIbeacon.startRanging(this.region);

                }, (e) => {
                    console.log("Authorisation denied by the user");
                });
        } else {
            console.log("Authorised");
            this.nativescriptIbeacon.startRanging(this.region);
        }
    }

    doStopScanning(): void {
        this._bluetooth.stopScanning().then(
            () => {
                this.isLoading = false;
            },
            (err) => {
                alert({
                    title: "Unable to stop.",
                    message: err,
                    okButtonText: "OK, so be it"
                });
            }
        );
        this.nativescriptIbeacon.stopRanging(this.region);
        this.isLoading = true;
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    showModal(uuid: string, $event: any): void {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            context: {},
            fullscreen: false
        };

        this.modalService.showModal(OmegaTraceCardModalComponent, options)
            .then((result: string) => {
                console.log(result);
            });
    }

    calculateDistance(rssi): number {
        const txPower = -59;

        if (rssi === 0) {
            return -1.0;
        }

        const ratio = rssi * 1.0 / txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        } else {
            const distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
            // @ts-ignore
            return distance;
        }
    }
    // delegate
    didRangeBeaconsInRegion(region: BeaconRegion, beacons: Array<Beacon>): void {
        console.log("didRangeBeaconsInRegion: " + region.identifier + " - " + beacons.length);
        // this.message = "didRangeBeaconsInRegion: " + (new Date().toDateString());
        for (const beacon of beacons) {
            console.log("B: " + beacon.proximityUUID + " - " + beacon.major + " - " + beacon.minor + " - "
                + beacon.distance_proximity + " - " + beacon.rssi + " - " + beacon.txPower_accuracy);
            // @ts-ignore
            const distance:number = this.calculateDistance(beacon.rssi).toFixed(1);
            let distanceString = "unavailable";
            if (distance > 0) {
                distanceString = distance + "m away";
            }
            this.peripherals.push({ name: "OmegaTrace Card", UUID: beacon.proximityUUID, distance: distanceString});
        }
    }

    didFailRangingBeaconsInRegion(region: BeaconRegion, errorCode: number, errorDescription: string): void {
        console.log("didFailRangingBeaconsInRegion: " + region.identifier + " - " + errorCode + " - "
            + errorDescription);
    }

    didEnterRegion(region: BeaconRegion): void {
        // TODO:
    }

    didExitRegion(region: BeaconRegion): void {
        // TODO:
    }

    onBeaconManagerReady(): void {
        // TODO:
    }
}
