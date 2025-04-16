import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";



export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiType, setApiType] = useState("");
  const [downloadZip, setDownloadZip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const initiateUpload = (apiType) => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setApiType(apiType);
    setIsDialogOpen(true);
  };

  const handleConfirmUpload = async () => {
    setIsDialogOpen(false);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
//api - https://sea-lion-app-xbx6q.ondigitalocean.app/
try {
      let response;
      alert(`Response: ${apiType}`)
      if (apiType === "midterm") {
        response = await axios.post(`https://sea-lion-app-xbx6q.ondigitalocean.app/${apiType}`, {
          config_path: "tmp/config.yaml",
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.data.zip_path) {
          setDownloadZip(response.data.zip_path);
        }
      } 
      else if (apiType === "finalexam") {

        response = await axios.post(`https://sea-lion-app-xbx6q.ondigitalocean.app/${apiType}`, {
          config_path: "tmp/config.yaml",
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.data.zip_path) {
          setDownloadZip(response.data.zip_path);
        }
      }
      
      else {
        response = await axios.post(`https://sea-lion-app-xbx6q.ondigitalocean.app/${apiType}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert(`Response: ${JSON.stringify(response.data)}`);
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadGeneratedZip = async () => {
    if (!downloadZip) {
      alert("No ZIP file available for download.");
      return;
    }
    
    try {
      const response = await axios.get(`https://sea-lion-app-xbx6q.ondigitalocean.app/download_zip/${downloadZip}`, {
        responseType: "blob",
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadZip;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Error:", error);
      alert("Error downloading ZIP file");
    }
  };

  return (
    <div className="file-upload-container">
      <h1>File Upload and API Request</h1>
      <input type="file" onChange={handleFileChange} />
      <div>
        <button
          onClick={() => initiateUpload("upload_config")}
          className="button button-blue"
          disabled={isLoading}
        >
          Upload File
        </button>
        <button
          onClick={() => initiateUpload("midterm")}
          className="button button-green"
          disabled={isLoading}
        >
          Midsem
        </button>

        <button
    onClick={() => initiateUpload("finalexam")}
    className="button button-orange"
    disabled={isLoading}
  >
    Final Exams
  </button>

      </div>
      {isLoading && <div className="loading">Processing... Please wait.</div>}
      {downloadZip && (
        <button onClick={downloadGeneratedZip} className="button button-purple">
          Download ZIP
        </button>
      )}
      {isDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Upload</h2>
            <p>Are you sure you want to upload this file?</p>
            <div className="modal-buttons">
              <button onClick={() => setIsDialogOpen(false)} className="button button-blue">
                Cancel
              </button>
              <button onClick={handleConfirmUpload} className="button button-green">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

