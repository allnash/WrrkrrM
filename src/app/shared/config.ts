export class Config {
    static protocol = "https://";
    static apiUrl = ".wrrkrr.com";
    static appKey = "kid_HyHoT_REf";
    static authHeader = "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ";
    static token = "";

    static getWorkspace(workspaceName:string):string{
        return this.protocol + workspaceName + this.apiUrl;
    }
}
