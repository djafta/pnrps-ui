export function useBase64() {

    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).replace('data:', '')?.replace(/^.+,/, '');

            return resolve(base64String);
        }
        reader.onerror = reject;
    });

    const fromBase64 = (string: string) => {
        const binaryString = window.atob(string);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {type: 'application/pdf'})

        return URL.createObjectURL(blob)
    };

    return {
        toBase64,
        fromBase64
    }
}