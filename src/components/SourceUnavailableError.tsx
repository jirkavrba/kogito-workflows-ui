import {FC} from "react";

export const SourceUnavailableError: FC = () => {
    return (
        <div className="flex flex-col m-4 p-4 rounded bg-danger">
            <strong>Workflow source code is not available.</strong>
            <p>
                Please check that the /source extension is enabled and accessible on the GraphQL endpoint.
            </p>
        </div>
    );
};
