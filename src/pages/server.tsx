import {FC} from "react";
import {useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/ServerNavbar.tsx";
import {useProcessInstances} from "../shared/useProcessInstances.tsx";
import {ConnectionError} from "../components/ConnectionError.tsx";
import {ProcessInstancesListing} from "../components/ProcessInstancesListing.tsx";
import {Spinner} from "@nextui-org/react";

const Loader: FC = () => {
    return (
        <div className="flex flex-row justify-center align-center p-20">
            <Spinner size="lg"/>
        </div>
    )
};

export const ServerPage: FC = () => {
    const {connection} = useParams();
    const configuration = useServerConfiguration(connection ?? "");
    const {data, isLoading, error} = useProcessInstances(configuration);

    return (
        <>
            <ServerNavbar configuration={configuration}/>
            <main>
                {
                    error !== null
                        ? <ConnectionError/>
                        : (
                            isLoading
                                ? <Loader/>
                                : <ProcessInstancesListing instances={data?.instances ?? []}/>
                        )
                }
            </main>
        </>
    );
};
