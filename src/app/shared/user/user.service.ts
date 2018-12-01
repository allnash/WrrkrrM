import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Config } from "../config";
import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    login(email: string, password: string) {
        let headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(User.workspaceName) + "/app/login",
            {email: email, password: password},
            {headers: headers});
    }

    register() {
        let headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(User.workspaceName) + "/app/signup",
            {workspace_name: User.workspaceName, email: User.email, password: User.password},
            {headers: headers});
    }

    verifyWorkspace(workspaceName: string) {
        let headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(workspaceName) + "/app/verifyworkspace",
            {name: workspaceName},
            {headers: headers});
    }

    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
        });

        return headers;
    }
}
