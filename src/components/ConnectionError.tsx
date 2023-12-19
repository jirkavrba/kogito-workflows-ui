import {FC} from "react";
import {Alert, AlertDescription, AlertIcon, AlertTitle} from "@chakra-ui/react";

export const ConnectionError: FC = () => {
    return (
        <Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
        >
            <AlertIcon boxSize='40px' mr={0}/>
            <AlertTitle mt={4} mb={1} fontSize='lg'>
                There was an error while connecting to the data index GraphQL endpoint!
            </AlertTitle>
            <AlertDescription maxWidth='2xl'>
                Please check that the configured URL is correct and that the endpoint is accessible from your network.
                Usually, a VPN connection is required for example.
            </AlertDescription>
        </Alert>
    );
};
