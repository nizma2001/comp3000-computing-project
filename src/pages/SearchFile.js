import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchFile = () => {
    const [files, setFiles] = useState([]); // Store files from S3
    const [searchTerm, setSearchTerm] = useState(""); // Store search input

    // Fetch file list from backend
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("http://localhost:7001/api/files/list-files"); // Adjust URL if needed
                setFiles(response.data);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

// Filter files based on search input
const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
    <div>
        <h2>Search Files</h2>
        <input
            type="text"
            placeholder="Search for a file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ul>
            {filteredFiles.length > 0 ? (
                filteredFiles.map((file, index) => (
                    <li key={index}>
                        {file.fileName} - {new Date(file.lastModified).toLocaleString()} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                ))
            ) : (
                <p>No files found</p>
            )}
        </ul>
    </div>
);
};

export default SearchFile;
