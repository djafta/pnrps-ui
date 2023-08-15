import {useRef, useState} from "react";

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
} from "@chakra-ui/modal";

import {Button, UseModalProps} from "@chakra-ui/react";

export interface WarningDeleteAlertDialogProps extends UseModalProps {
    readonly title: string
    readonly description: string
    readonly onConfirm: () => void
}

export function WarningAlertDialog({title, description, onConfirm, isOpen, onClose}: WarningDeleteAlertDialogProps) {
    const cancelRef = useRef<HTMLButtonElement | null>(null);
    const [isLoading, setLoading] = useState(false);

    async function handleConfirmClick() {
        setLoading(true);
        await onConfirm()
        setLoading(false);
    }

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay/>

            <AlertDialogContent>
                <AlertDialogHeader>
                    {title}
                </AlertDialogHeader>
                <AlertDialogCloseButton/>
                <AlertDialogBody>
                    {description}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Não
                    </Button>
                    <Button isLoading={isLoading} onClick={handleConfirmClick} variant={"outline"} colorScheme='red'
                            ml={3}>
                        Sim
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}