import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Config } from "../config";
import { User } from "../user/user.model";

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    getBeaconDevice(UUID: string, major: string, minor: string) {
        const headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(User.workspaceName) + "/app/getbeacondevice",
            {UUID, major, minor},
            {headers});
    }

    private createRequestHeader() {
        // set headers here e.g.
        const headers = new HttpHeaders({
            "Content-Type": "application/json"
        });

        return headers;
    }
}
