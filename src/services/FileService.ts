export default class FileService {
    static async toBase64(blob: Blob) {
        return new Promise<string | ArrayBuffer | null>(((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        }))
    }
}