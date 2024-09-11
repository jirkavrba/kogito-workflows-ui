import {ServerConfiguration} from "../types/ServerConfiguration.ts";

export const resolveConfiguredHeaders = (configuration: ServerConfiguration): { Authorization?: string, Host?: string } | undefined => {
    const authorization = configuration.authorizationHeader?.trim();
    const host = configuration.overriddenHostHeader?.trim();

    if ((!authorization && !host) || (authorization?.length === 0 && host?.length === 0)) {
        return undefined;
    }

    return {
        Authorization: authorization,
        Host: host,
    }
}
