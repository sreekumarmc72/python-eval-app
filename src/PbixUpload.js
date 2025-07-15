import React, { useState } from 'react';

const PbixUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Update state when the user selects a file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload the file to Power BI
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }
    
    // Create a FormData object and append the file.
    const formData = new FormData();
    // "file" is the key; some APIs might expect a different key name
    formData.append('file', file);

    // Use the file name (including .pbix extension) as the dataset display name
    const datasetDisplayName = file.name;
    
    // Build the URL; you can add additional query parameters like nameConflict if needed
    const url = `https://api.powerbi.com/v1.0/myorg/imports?datasetDisplayName=${encodeURIComponent(datasetDisplayName)}`;

    try {
      setUploadStatus('Uploading...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // IMPORTANT: Do NOT set Content-Type when using FormData.
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSIsImtpZCI6IkpETmFfNGk0cjdGZ2lnTDNzSElsSTN4Vi1JVSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYTI5NDU0ODYtMTYwNi00MmM1LWJmZWMtMTcwNDU5MDQyMjViLyIsImlhdCI6MTc0MTc1ODI2NCwibmJmIjoxNzQxNzU4MjY0LCJleHAiOjE3NDE3NjIxOTUsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84WkFBQUF6Sm0yUlVoN2VldFZTSi8vMzRxaGtZOFpGRmZnaWsrSk5LYmkxYkxSaytqSnpPRWdGVUhjT0pGdWZ1elJPZ2FBb1FNVHE2R1pCcHFiZ3pPNHN4d1ZlenVoRGVKUkFhN1AvMFZqOTZ0REdnVT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMThmYmNhMTYtMjIyNC00NWY2LTg1YjAtZjdiZjJiMzliM2YzIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCSSIsImdpdmVuX25hbWUiOiJQb3dlciIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjExMS45Mi43OC4xNDAiLCJuYW1lIjoiUG93ZXIgQkkiLCJvaWQiOiJmMTJlNGQ4MS05Y2UwLTQzNDAtYmFiMC02YTIzZmZiNjdiODAiLCJwdWlkIjoiMTAwMzIwMDQ0NDU1M0NBQyIsInJoIjoiMS5BVlVBaGxTVW9nWVd4VUtfN0JjRVdRUWlXd2tBQUFBQUFBQUF3QUFBQUFBQUFBQ0lBTlZWQUEuIiwic2NwIjoiQXBwLlJlYWQuQWxsIENhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29ubmVjdGlvbi5SZWFkLkFsbCBDb25uZWN0aW9uLlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGFmbG93LlJlYWQuQWxsIERhdGFmbG93LlJlYWRXcml0ZS5BbGwgRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwgR2F0ZXdheS5SZWFkLkFsbCBHYXRld2F5LlJlYWRXcml0ZS5BbGwgSXRlbS5FeGVjdXRlLkFsbCBJdGVtLkV4dGVybmFsRGF0YVNoYXJlLkFsbCBJdGVtLlJlYWRXcml0ZS5BbGwgSXRlbS5SZXNoYXJlLkFsbCBPbmVMYWtlLlJlYWQuQWxsIE9uZUxha2UuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBSZXBydC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkV3JpdGUuQWxsIFRlbmFudC5SZWFkLkFsbCBUZW5hbnQuUmVhZFdyaXRlLkFsbCBVc2VyU3RhdGUuUmVhZFdyaXRlLkFsbCBXb3Jrc3BhY2UuR2l0Q29tbWl0LkFsbCBXb3Jrc3BhY2UuR2l0VXBkYXRlLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWRXcml0ZS5BbGwiLCJzaWQiOiIwMDIwMTMwOS1kZDA4LTg3OGEtMzM4OC02NDZlNzA5NmI5MmQiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJwaWFUUG51TXVORVd2cmh3dUtqMGdWdGhqUEFVd1hHMkhNaW1TU3l4UmFrIiwidGlkIjoiYTI5NDU0ODYtMTYwNi00MmM1LWJmZWMtMTcwNDU5MDQyMjViIiwidW5pcXVlX25hbWUiOiJwb3dlcmJpQG5lcmd5aW5kaWEuY29tIiwidXBuIjoicG93ZXJiaUBuZXJneWluZGlhLmNvbSIsInV0aSI6InBmVEhURjhCMzBPTTFIcWhfeUFxQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIyNiAxIn0.SgIVCJ9jYZFgrOBCIEhkyI90TiNAWBpKTX_SqT8vuLLmESHAjupPDR0ukW3oJSlwytZF7hEvaJ5zaqwr9J5dGRaH2c8TKsM1EYETyLj4nNfn0ddITegE-fEWSpH8H_CoQ_Wd7Ipbt7PPfBvEWkHzJGaK0ve3qldukhSYMT_bfUB5Dp7ih6YGHSkVqz3K3oCfnJP0PZ0r4Sp7zHgUIvx3oX3xHF-Yzyew9_XUGvDqtpJmWZM9dQIpU6_rp3Fjg_zoDYZ3JlhpwmBhhZNjOk1VcsOsGTWjEl7GA37QdPAG5xoM_b_WaVbKVIoYYwdCLSWLCD9CbfU7D-vJY1UAYCXxDA'
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`Upload successful! Import ID: ${data.id}`);
      } else {
        // Try to extract error details from the response
        const errorData = await response.json();
        setUploadStatus(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload .pbix File to Power BI</h2>
      <input 
        type="file" 
        accept=".pbix" 
        onChange={handleFileChange} 
      />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default PbixUpload;
