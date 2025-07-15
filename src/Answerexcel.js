import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomView.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button } from "react-bootstrap";
import * as XLSX from "xlsx";

const Answer = ({ qn }) => {
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [mismatchCells, setMismatchCells] = useState([]);
    const [unmatchedFields, setUnmatchedFields] = useState([]);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                setErrorMessage("Please upload a valid .xlsx file.");
                return;
            }
            setFile(droppedFile);
        }
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setErrorMessage("");
        setMismatchCells([]);
        setUnmatchedFields([]);
        if (uploadedFile) {
            if (uploadedFile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                setErrorMessage("Please upload a valid .xlsx file.");
                return;
            }
            setFile(uploadedFile);
        }
    };

    const handleUploadButton = () => {
        if (file) {
            alert(`File "${file.name}" uploaded successfully!`);
        } else {
            alert("Please upload a file first!");
        }
    };

    const handleValidateButton = () => {

        console.log('validate button clicked');
        setErrorMessage("");
        setUnmatchedFields([]);
        // Check if all fields are filled
        const allFieldsFilled = qn.fields.every((field, index) => fieldValues[index]);
        if (!allFieldsFilled || file == null) {
            setErrorMessage("Please fill all fields and upload the solved xlsx file.");
            return;
        }

        console.log('all fields filled');

        // Check if field values match
        const unmatchedFields = qn.fields.map((field, index) => fieldValues[index] !== field.value ? index : -1).filter(index => index !== -1);
        if (unmatchedFields.length > 0) {
            setErrorMessage("Field values mismatch. Please correct them before validating the Excel file.");
            setUnmatchedFields(unmatchedFields);
            return;
        }

        console.log('all fields match');

        // Validate the uploaded file
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);

                console.log('data', data);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                console.log('qn.cells', qn.cells);

                const mismatches = qn.cells.filter(cell => {
                    const cellFormula = (worksheet[cell.name]?.f || "").toString().toLowerCase();
                    console.log('cellFormula', cellFormula);
                    console.log('cell.value', cell);

                    return cellFormula !== cell.value.toLowerCase();
                });

                if (mismatches.length === 0) {
                    setShowModal(true);
                    setErrorMessage("");
                } else {
                    setMismatchCells(mismatches);
                    setErrorMessage("Excel Sheet Validation: Shown inputs are invalid on Cell Number");
                }
            } catch (err) {
                setErrorMessage("Failed to process the uploaded file. Please ensure it is a valid .xlsx file.");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFile(null);
        setFieldValues({});
        setErrorMessage("");
        setMismatchCells([]);
        setUnmatchedFields([]);
    };

    const handleInputChange = (index, value) => {
        setFieldValues((prevValues) => ({
            ...prevValues,
            [index]: value,
        }));
    };

    return (
        <div>
            <div className="container answer-block">
                {qn.fields.map((field, index) => (
                    <div className="row mb-4" key={index}>
                        <div className="col-md-6" style={{ textAlign: "left" }}>
                            <label className="form-label qn-label">{field.label}</label>
                        </div>
                        <div className="col-md-6" style={{ textAlign: "right" }}>
                            <input
                                className="input-field"
                                placeholder="Enter the Value"
                                value={fieldValues[index] || ""}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                style={{
                                    backgroundColor: unmatchedFields.includes(index) ? '#B52556' : 'white',
                                    color: unmatchedFields.includes(index) ? 'white' : 'black'
                                }}
                            />
                        </div>
                    </div>
                ))}

                {/* Drag-and-Drop Section */}
                <div className="upload-area text-center">
                    <div
                        className="drag-drop-area rounded text-center p-4 pb-5 pt-4"
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        style={{ backgroundColor: errorMessage ? '#FCE8F1' : (file ? '#F4FCF6' : 'white') }}
                    >
                        <div className="upload-icon mb-1">
                            <i className={`bi bi-cloud-arrow-up-fill text-4xl ${file ? 'text-success' : 'text-primary'}`}></i>
                        </div>

                        {/* Uploaded File Name */}
                        {file && (
                            <div>
                                <div className="replace-file" onClick={() => document.getElementById('file-upload').click()}>Replace file</div>
                                <div className="file-name" style={{ display: "flex", alignItems: "center", borderBottom: file ? "6px solid green" : "none" }}>
                                <i className="bi bi-file-earmark" style={{ padding: "5px", "paddingRight": "10px" }}></i>
                                <div style={{ textAlign: "left", marginLeft: "10px" }}>
                                    <span>{file.name}</span> <br />
                                    <span style={{ color: "grey", fontWeight: "lighter" }}>{(file.size / 1024).toFixed(2)} KB</span>
                                </div>
                            </div>
                            </div>
                        )}

                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileUpload}
                            hidden
                        />
                        <div>
                            <p className="mb-1" style={{ fontSize: "19px" }}>
                                Drag your excel file or{" "}
                                <label htmlFor="file-upload" className="text-primary cursor-pointer underline" style={{ fontWeight: "bolder" }}>
                                    browse
                                </label>
                            </p>
                            <div className="text-muted">Supported file: .xls, .xlsx</div>
                        </div>
                    </div>

                    {/* Upload Button */}
                    {/* <button
                        className="upload-btn mt-5 mb-2"
                        onClick={handleUploadButton}
                    >
                        Upload
                    </button> */}
                </div>
                <div className="row error-area">
                    {errorMessage && <div >{errorMessage}</div>}
                    {mismatchCells.length > 0 && (
                        <div className="mt-2">
                            <div style={{ color: "grey" }}>
                                {mismatchCells.map((cell, index) => (
                                    <span key={index}>{cell.name} </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section with Validate Button */}
            <div className="bottom-section" style={{ backgroundColor: errorMessage ? '#FCE8F1' : '#fff' }}>
                <div className="errors-found">
                    {errorMessage && (
                        <div>
                            <img src={require('./error.png')} alt="Warning" style={{ width: "30px", marginRight: "13px" }} />
                            <span>Errors found!</span>
                        </div>
                    )}
                </div>
                <div className="col text-right">
                    <button
                        className="validate-btn"
                        onClick={handleValidateButton}
                    >
                        {errorMessage ? "Retry" : "Validate"}
                    </button>
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body style={{ background: "linear-gradient(to bottom, #e0f7fa 0%, #fff 100%)" }}>
                    <div className="text-center" style={{ margin: "20px 20px", fontSize: "21px" }}>
                        <img src={require('./degree.png')} alt="Success" style={{ width: "250px", marginBottom: "20px" }} />
                        <p style={{ fontWeight: "bold", fontSize: "30px" }}>Congratulations!</p>
                        <p>You have completed the task successfully.</p>
                        <Button className="done-btn mt-3 mb-3" onClick={handleCloseModal}>
                            Done
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Answer;
