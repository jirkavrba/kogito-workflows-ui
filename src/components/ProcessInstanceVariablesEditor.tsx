import {FC, useEffect, useMemo, useState} from "react";
import {DiffEditor, Editor, useMonaco} from "@monaco-editor/react";
import {Button, ButtonGroup, Modal, ModalBody, ModalContent, Spinner, useDisclosure} from "@nextui-org/react";
import {LuDiff, LuSave, LuTrash} from "react-icons/lu";
import {useWorkflowVariablesMutation} from "../shared/useWorkflowVariablesMutation.tsx";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";

export type ProcessInstanceVariablesEditorProps = {
    id: string;
    variables: object;
    configuration: ServerConfiguration;
};

const validate = (json: string) => {
    try {
        JSON.parse(json);
        return true
    } catch {
        return false;
    }
}

const jsonEquals = (first: string, second: string) => {
    return JSON.stringify(JSON.parse(first)) === JSON.stringify(JSON.parse(second));
}

export const ProcessInstanceVariablesEditor: FC<ProcessInstanceVariablesEditorProps> = ({variables, configuration, id}) => {
    const monaco = useMonaco();

    const [originalValue, setOriginalValue] = useState(JSON.stringify(variables, null, 2));
    const [updatedValue, setUpdatedValue] = useState(originalValue)

    const updatedValueValid = useMemo(() => validate(updatedValue), [updatedValue]);
    const pendingChanges = useMemo(() => updatedValueValid && !jsonEquals(originalValue, updatedValue), [updatedValueValid, originalValue, updatedValue]);

    const {isOpen: updatedValueDiffOpen, onOpen: openUpdatedValueDiff, onClose: closeUpdatedValueDiff} = useDisclosure();
    const {mutate, isPending} = useWorkflowVariablesMutation(configuration, id);
    const updateWorkflowVariables = () => {
        const minified = JSON.stringify(JSON.parse(updatedValue));
        mutate(minified, {
            onSuccess: () => {
                setOriginalValue(updatedValue);
            }
        })
    };

    useEffect(() => {
        const formatted = JSON.stringify(variables, null, 2);

        setOriginalValue(formatted);

        if (!pendingChanges) {
            setUpdatedValue(formatted)
        }
    }, [variables, pendingChanges]);

    useEffect(() => {
        monaco?.editor?.defineTheme("kogito", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#000000"
            }
        })
    }, [monaco]);

    // TODO: Split this into separate components

    return (
        <>
            {!updatedValueValid && (
                <div className="flex flex-col items-start justify-start bg-danger p-4 rounded-lg mb-2">
                    <h3 className="text-sm font-medium">Invalid JSON</h3>
                    <p className="text-xs">Updating workflow variables will fail.</p>
                </div>
            )}
            {pendingChanges && (
                <div className="flex flex-row items-center justify-between bg-default-100 p-2 px-4 rounded-lg mb-2">
                    <h3 className="text-sm font-medium">
                        Workflow variables changed
                    </h3>
                    <ButtonGroup>
                        <Button onClick={() => setUpdatedValue(originalValue)} disabled={isPending}>
                            <LuTrash/>
                            Discard changes
                        </Button>
                        <Button onClick={openUpdatedValueDiff} disabled={isPending}>
                            <LuDiff/>
                            View diff
                        </Button>
                        <Button color="primary" onClick={updateWorkflowVariables} isLoading={isPending} disabled={isPending}>
                            <LuSave/>
                            Save
                        </Button>
                    </ButtonGroup>
                </div>
            )}
            <Editor
                language="json"
                value={updatedValue}
                loading={<Spinner size="lg"/>}
                theme={"kogito"}
                onChange={(value) => setUpdatedValue(value ?? "")}
                options={{
                    lineNumbers: "off",
                    theme: "kogito",
                    contextmenu: false,
                    cursorSmoothCaretAnimation: "on",
                    bracketPairColorization: {
                        enabled: false
                    }
                }}
                height="70vh"
            />
            {
                updatedValueDiffOpen && (
                    <Modal isOpen={updatedValueDiffOpen} onClose={closeUpdatedValueDiff} size="full">
                        <ModalContent>
                            <ModalBody>
                                <DiffEditor
                                    className="m-8"
                                    language={"json"}
                                    original={JSON.stringify(JSON.parse(originalValue), null, 2)}
                                    modified={JSON.stringify(JSON.parse(updatedValue), null, 2)}
                                    theme="kogito"
                                    options={{
                                        readOnly: true,
                                        lineNumbers: "off",
                                        contextmenu: false,
                                        cursorSmoothCaretAnimation: "on",
                                        bracketPairColorization: {
                                            enabled: false
                                        }
                                    }}
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                )
            }
        </>
    );
}
