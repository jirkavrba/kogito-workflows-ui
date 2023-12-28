import {FC, useEffect, useMemo, useState} from "react";
import {DiffEditor, Editor, useMonaco} from "@monaco-editor/react";
import {Button, ButtonGroup, Modal, ModalBody, ModalContent, Spinner, useDisclosure} from "@nextui-org/react";
import {LuDiff, LuSave} from "react-icons/lu";
// import {useLocalStorage} from "usehooks-ts";

export type ProcessInstanceVariablesEditorProps = {
    variables: object;
};

export const ProcessInstanceVariablesEditor: FC<ProcessInstanceVariablesEditorProps> = ({variables}) => {
    const monaco = useMonaco();

    const formatted = useMemo(() => JSON.stringify(variables, null, 2), [variables]);
    const originalValue = JSON.stringify(variables);
    const [updatedValue, setUpdatedValue] = useState(originalValue)
    const {isOpen: updatedValueDiffOpen, onOpen: openUpdatedValueDiff, onClose: closeUpdatedValueDiff} = useDisclosure();

    const updatedValueValid = useMemo(() => {
            try {
                JSON.parse(updatedValue);
                return true
            } catch {
                return false;
            }
        },
        [updatedValue]
    );

    const pendingChanges = useMemo(() =>
            updatedValueValid && JSON.stringify(JSON.parse(originalValue)) != JSON.stringify(JSON.parse(updatedValue)),
        [originalValue, updatedValue]
    );

    // const [snapshots, setSnapshots] = useLocalStorage("workflow-data-snapshots", []);
    // const [watches, setWatches] = useLocalStorage("workflow-data-watches", []);

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

    return (
        <>
            {!updatedValueValid && (
                <div className="flex flex-col items-start justify-start bg-danger p-2 rounded-t-lg">
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
                        <Button onClick={openUpdatedValueDiff}>
                            <LuDiff/>
                            View diff
                        </Button>
                        <Button color="primary">
                            <LuSave/>
                            Save
                        </Button>
                    </ButtonGroup>
                </div>
            )}
            <Editor
                language="json"
                value={formatted}
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
                height="100vh"
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
