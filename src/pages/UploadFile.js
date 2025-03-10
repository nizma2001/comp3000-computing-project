import { useState } from "react";
import axios from "axios";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            // Step 1: Get pre-signed URL from backend
            const response = await axios.post("http://localhost:7001/api/files/presigned-url", {
                fileName: file.name,
                fileType: file.type,
            });

            const { presignedUrl } = response.data;

            console.log(presignedUrl);

            // Step 2: Upload the file to S3 using the pre-signed URL
            await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            setMessage("File uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>Upload File to S3</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadFile;