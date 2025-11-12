// src/pages/UploadPage.js
import React, { useState } from "react";
import ResponseBox from "../components/ResponseBox"; // Import ResponseBox
import LoadingSpinner from "../components/LoadingSpinner"; // Import LoadingSpinner


function UploadPage({ token }) {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state


  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#5563DE",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handleUpload = async () => {
    setResponse(""); // Clear previous response
    if (!file) {
        setResponse("Please select a file to upload.");
        return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    // Hardcoded values from the openapi.json for the record details.
    // In a real application, you would have forms to capture these.
    // For now, these are placeholder values to make the upload work with the API.
    formData.append("title", file.name || "Uploaded File");
    formData.append("description", "File uploaded from React app");
    formData.append("category_id", "a1b2c3d4-e5f6-7890-1234-567890abcdef"); // Replace with actual category ID
    formData.append("user_id", "12345678-1234-1234-1234-1234567890ab"); // Replace with actual user ID from the token
    formData.append("media_type", "document"); // Assuming 'document' based on file upload context
    formData.append("release_rights", "creator");
    formData.append("language", "english");
    formData.append("upload_uuid", crypto.randomUUID()); // Generate a UUID for the upload session
    formData.append("filename", file.name);
    formData.append("total_chunks", 1); // Assuming single chunk upload for simplicity


    try {
      const res = await fetch("http://api.corpus.swecha.org/api/v1/records/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type" is not needed for FormData, browser sets it.
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
          setResponse(`✅ Upload successful!\n${JSON.stringify(data, null, 2)}`);
      } else {
          setResponse(`❌ Upload failed: ${data.detail || JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setResponse(`❌ Error uploading file: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📂 Upload Records</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "15px" }}
          disabled={isLoading}
        />
        <button onClick={handleUpload} style={buttonStyle} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : "Upload"}
        </button>
        {response && <ResponseBox text={response} />}
      </div>
    </div>
  );
}

export default UploadPage;