import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthProvider";
import '../CSS/table-styling.css';

const SearchFile = () => {

    //save user role from auth context

    const { auth } = useContext(AuthContext);
    const [files, setFiles] = useState([]); // Store files from S3
    const [searchTerm, setSearchTerm] = useState(""); // Store search input

    // Get file list from backend 

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("http://localhost:7001/api/files/list-files"); 

                console.log("Files fetched:", response.data); //debug step
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

//function to delete file


const handleDelete = async (fileKey) => {
    console.log("Attempting to delete file with key:", fileKey);  //debug step
    try {
        await axios.delete(`http://localhost:7001/api/files/delete/${fileKey}`);
        console.log("code reached");
        setFiles(files.filter(file => file.fileKey !== fileKey)); //remove file from the table
        
    } catch (error) {
        console.error("Delete failed:", error);
    }
};

//function to download file

const handleDownload = async (fileKey) => {
    console.log("Attempting to download file with key:", fileKey); //debug
    try {
        const response = await axios.get(`http://localhost:7001/api/files/download/${fileKey}`, {
            responseType: 'blob', // 
        });
        
        // Create a URL and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileKey);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Download failed:", error);
    }
};

return (
    <div className="file-container">
            <h2>Search Files</h2>
            <input
                type="text"
                placeholder="Search for a file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredFiles.length > 0 ? (
                <table className="file-table">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Last Modified</th>
                            <th>Size (KB)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFiles.map((file, index) => (
                            <tr key={index}>
                                <td>{file.fileName}</td>
                                <td>{new Date(file.lastModified).toLocaleString()}</td>
                                <td>{(file.size / 1024).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleDownload(file.fileKey)}>Download</button>
                                    {auth?.roles === "admin" && (
                                        <button onClick={() => handleDelete(file.fileKey)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No files found</p>
            )}
        </div>
);
};

export default SearchFile;
