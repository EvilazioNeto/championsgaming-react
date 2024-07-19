interface FileInformation {
    name: string;
    type: string | undefined;
    size: number;
    lastModified: string;
    fullPath: string;
    downloadURL: string;
}

export default FileInformation;