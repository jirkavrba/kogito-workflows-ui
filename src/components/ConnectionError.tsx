import {FC} from "react";

export const ConnectionError: FC = () => {
    return (
        <div className="flex flex-col m-4 p-4 rounded bg-danger">
            <strong>There was an error while connecting to the data index GraphQL endpoint!</strong>
            <p>
                Please check that the configured URL is correct and that the endpoint is accessible from your network.
                Usually, a VPN connection is required to connect.
            </p>
        </div>
    );
};
