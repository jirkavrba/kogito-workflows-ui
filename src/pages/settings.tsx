import { FC } from "react";
import { useSettings } from "../shared/useSettings";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { EnabledFeaturesSettings } from "../components/settings/EnabledFeaturesSettings";

export const SettingsPage: FC = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useSettings();

    return (
        <Card className="m-8 p-8">
            <h1 className="text-xl font-bold text-left mx-3">Settings</h1>

            <CardBody>
                <div className="border-2 p-4 my-4 rounded-xl">
                    <h2 className="text-lg font-bold text-left">Enabled features</h2>
                    <EnabledFeaturesSettings
                        enabledFeatures={settings.enabledFeatures}
                        setEnabledFeatures={(features) => setSettings(current => ({ ...current, enabledFeatures: features }))}
                    />
                </div>
            </CardBody>

            <CardFooter>
                <Button color="primary" onClick={() => navigate(-1)}>
                    Save settings and return
                </Button>
            </CardFooter>
        </Card>
    )
};