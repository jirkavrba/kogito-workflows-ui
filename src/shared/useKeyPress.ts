import { useEffect } from "react"

export const useKeyPress = (key: string, callback: (event: KeyboardEvent) => void) => {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key == key) {
                callback(event);
            }
        };

        window.addEventListener("keyup", handler)
        return () => window.removeEventListener("keyup", handler);
    }, [callback, key]);
}