import { useState } from "react";
import axios from "axios";
import {ethers} from "ethers";
import { sha256} from "js-sha256";
import contractABI from '../abi/storeHash.json';



const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
console.log(contractAddress);
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const storeHashContract = new ethers.Contract(contractAddress, contractABI.abi, signer);



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
            // read file and calculate file hash
            const buffer = await file.arrayBuffer();
            const fileUint8 = new Uint8Array(buffer);
            console.log("Upload file size:", fileUint8.length);
            const hashHex = sha256(fileUint8); // SHA-256 hex string
            const hashBytes32 = "0x" + hashHex; // Convert to bytes32 format

            //debug step
            console.log("Calculated file hash:", hashBytes32);

            // get presigned url to upload file 
            const response = await axios.post("http://localhost:7001/api/files/presigned-url", {
                fileName: file.name,
                fileType: file.type,
            });

            const { presignedUrl } = response.data;
            console.log(presignedUrl); // debug step

            // upload file to s3 bucket
            await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            setMessage("File uploaded successfully!");

            //connect backend with metamask wallet
            const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(account); //debug

            //store hash on the blockchain
            const tnx = await storeHashContract.storeFileHash(file.name, hashBytes32);
            await tnx.wait();
            console.log("Hash stored on blockchain!");
    
            
            setMessage("File uploaded and hash stored on blockchain!");
         //debug step

        } catch (error) {
            console.error("Upload error:", error);
            setMessage("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
    <div className="card p-4 shadow" style={{ width: "30rem" }}>
      <h2 className="text-center mb-4">Upload File</h2>
      <div className="mb-3">
        <input 
          type="file" 
          className="form-control" 
          onChange={handleFileChange} 
        />
      </div>
      <div className="d-grid gap-2">
        <button 
          onClick={handleUpload} 
          className="btn btn-primary" 
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {" "}Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
      {message && (
        <div className={`alert mt-3 ${message.includes("success") ? "alert-success" : "alert-info"}`} role="alert">
          {message}
        </div>
      )}
    </div>
  </div>
    );
};

export default UploadFile;