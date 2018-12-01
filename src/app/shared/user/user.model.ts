import { SecureStorage } from "nativescript-secure-storage";

export class User {

    static secureStorage = new SecureStorage();
    static id: string;
    static email: string;
    static firstName: string;
    static lastName: string;
    static password: string;
    static sessionId: string;
    static isTwoFactored: boolean;
    static workspaceName: string;
    static profileImageUrl: string;

    static doRemoveAllSync() {
        this.secureStorage.removeAllSync();
        console.log("Removed all keys from secure storage.");
    }

    // a method that can be called from your view
    static doSetAllSync() {
        this.secureStorage.setSync({
            key: "wrrkrr.id",
            value: this.id
        });
        this.secureStorage.setSync({
            key: "wrrkrr.email",
            value: this.email
        });
        this.secureStorage.setSync({
            key: "wrrkrr.first_name",
            value: this.firstName
        });
        this.secureStorage.setSync({
            key: "wrrkrr.last_name",
            value: this.lastName
        });
        this.secureStorage.setSync({
            key: "wrrkrr.session_id",
            value: this.sessionId
        });
        this.secureStorage.setSync({
            key: "wrrkrr.is_two_factored",
            value: String(this.isTwoFactored)
        });
        this.secureStorage.setSync({
            key: "wrrkrr.profile_image_url",
            value: String(this.profileImageUrl)
        });
    }

    static getAllSecureValues() {
        this.id = this.secureStorage.getSync({
            key: "wrrkrr.id"
        });
        this.email = this.secureStorage.getSync({
            key: "wrrkrr.email"
        });
        this.firstName = this.secureStorage.getSync({
            key: "wrrkrr.first_name"
        });
        this.lastName = this.secureStorage.getSync({
            key: "wrrkrr.last_name"
        });
        this.sessionId = this.secureStorage.getSync({
            key: "wrrkrr.session_id"
        });
        this.isTwoFactored = Boolean(this.secureStorage.getSync({
            key: "wrrkrr.is_two_factored"
        }));
        this.profileImageUrl = this.secureStorage.getSync({
            key: "wrrkrr.profile_image_url"
        });
    }
}
