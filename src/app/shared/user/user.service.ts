import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Config } from "../config";
import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    login(email: string, password: string) {
        const headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(User.workspaceName) + "/app/login",
            {email, password},
            {headers});
    }

    register() {
        const headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(User.workspaceName) + "/app/signup",
            {workspace_name: User.workspaceName, email: User.email, password: User.password},
            {headers});
    }

    verifyWorkspace(workspaceName: string) {
        const headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(workspaceName) + "/app/verifyworkspace",
            {name: workspaceName},
            {headers});
    }

    logout(sessionId: string) {
        const headers = this.createRequestHeader();
        return this.http.post(Config.getWorkspace(User.workspaceName) + "/app/removesession",
            {session_id: sessionId},
            {headers});
    }

    private createRequestHeader() {
        // set headers here e.g.
        const headers = new HttpHeaders({
            "Content-Type": "application/json",
        });

        return headers;
    }
}
