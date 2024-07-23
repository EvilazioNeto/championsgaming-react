import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import FileInformation from "../interfaces/FileInformation";

export async function formatFile(file: any, userId: number | undefined, onProgress: (progress: number) => void): Promise<FileInformation> {

    const storageRef = ref(storage, `users/${userId}/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                console.error("Erro ao enviar arquivo para o Firebase:", error);
                reject(new Error("Erro ao enviar arquivo para o Firebase."));
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({
                        name: uploadTask.snapshot.metadata.name,
                        type: uploadTask.snapshot.metadata.contentType,
                        size: uploadTask.snapshot.metadata.size,
                        lastModified: uploadTask.snapshot.metadata.updated,
                        fullPath: uploadTask.snapshot.metadata.fullPath,
                        downloadURL: downloadURL
                    });
                } catch (error) {
                    console.error("Erro ao obter URL de download do Firebase:", error);
                    reject(new Error("Erro ao obter URL de download do Firebase."));
                }
            }
        );
    });
}
