import {ThemeTypings} from "@chakra-ui/react";

export const processInstanceStateColor = (state: string): ThemeTypings["colorSchemes"] => {
    return {
        "ACTIVE": "green",
        "COMPLETED": "blue",
        "ERROR": "red",
    }[state] ?? "gray";
}
