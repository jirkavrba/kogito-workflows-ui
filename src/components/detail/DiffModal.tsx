import {FC} from "react";
import {Modal, ModalBody, ModalContent} from "@nextui-org/react";
import {DiffEditor} from "@monaco-editor/react";
import {formatJson} from "../../helpers/json.ts";

export type DiffModalProps = {
    onClose: () => void;
    originalValue: string;
    updatedValue: string;
};

export const DiffModal: FC<DiffModalProps> = ({originalValue, updatedValue, onClose}) => {

    return (
        <Modal isOpen={true} onClose={onClose} size="full">
            <ModalContent>
                <ModalBody>
                    <DiffEditor
                        className="m-8"
                        language={"json"}
                        original={formatJson(originalValue)}
                        modified={formatJson(updatedValue)}
                        theme="vs-dark"
                        options={{
                            readOnly: true,
                            lineNumbers: "off",
                            contextmenu: false,
                            cursorSmoothCaretAnimation: "on"
                        }}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
