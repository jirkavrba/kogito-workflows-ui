export type ServerConfiguration = {
    readonly id: string;
    readonly name: string;
    readonly url: string;
    readonly authorizationHeader?: string;
    readonly overriddenHostHeader?: string;
};
