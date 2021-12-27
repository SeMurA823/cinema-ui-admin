import imageCompression from "browser-image-compression";

export default class FileService {
    static async toBase64(file: File) {
        const compressedFile = await imageCompression(file,
            {
                maxWidthOrHeight: 800,
                maxSizeMB: 0.5
            });
        const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
        return base64;
    }
}