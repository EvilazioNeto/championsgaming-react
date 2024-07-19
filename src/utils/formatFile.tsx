import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

export async function formatFile(file: any, userId: number | undefined) {

    const storageRef = ref(storage, `users/${userId}/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            name: snapshot.metadata.name,
            type: snapshot.metadata.contentType,
            size: snapshot.metadata.size,
            lastModified: snapshot.metadata.updated,
            fullPath: snapshot.metadata.fullPath,
            downloadURL: downloadURL
        };
    } catch (error) {
        console.error("Erro ao enviar arquivo para o Firebase:", error);
        throw new Error("Erro ao enviar arquivo para o Firebase.");
    }

}