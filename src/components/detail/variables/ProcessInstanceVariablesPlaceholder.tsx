import { Button, Card, CardBody } from "@nextui-org/react";
import { FC } from "react";
import { LuCog } from "react-icons/lu";
import { NavLink } from "react-router-dom";

export const ProcessInstanceVariablesPlaceholder: FC = () => {
    return (
        <Card className="mx-4">
            <CardBody className="text-center py-8">
                <h1 className="text-xl font-bold text-center mx-3">Variables editor is not enabled</h1>
                <span>This feature needs to be enabled in the settings.</span>

                <NavLink to="/settings" className="mt-8">
                    <Button>
                        <LuCog />
                        Open settings
                    </Button>
                </NavLink>
            </CardBody>
        </Card>
    )
};