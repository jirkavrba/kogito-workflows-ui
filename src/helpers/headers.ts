import {ServerConfiguration} from "../types/ServerConfiguration.ts";

export const resolveAuthenticationHeaders = (configuration: ServerConfiguration): { Authorization: string } | undefined => {
    const header = configuration.authorizationHeader?.trim()

    if (!header || header.length === 0) {
        return undefined;
    }

    return {
        Authorization: header
    }
}
