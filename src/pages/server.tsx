import {FC} from "react";
import {useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/ServerNavbar.tsx";
import {useProcessInstances} from "../shared/useProcessInstances.tsx";
import {Flex, Spinner} from "@chakra-ui/react";
import {ConnectionError} from "../components/ConnectionError.tsx";
import {ProcessInstancesListing} from "../components/ProcessInstancesListing.tsx";

const Loader: FC = () => {
    return (
        <Flex justifyContent="center" alignItems="center" p={10}>
            <Spinner size="xl"/>
        </Flex>
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
