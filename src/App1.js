import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import * as XLSX from "xlsx";

function App() {
    const [question, setQuestion] = useState("What is the formula in cell A5 that calculates the sum of A1:A4?");
    const [answer, setAnswer] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const validateSubmission = () => {
        if (!answer.trim() || !uploadedFile) {
            setError("Please fill in all fields and upload the file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                console.log('worksheet', worksheet);
                const cellA5 = (worksheet["A5"]?.f || "").toString().toLowerCase();
                console.log('cellA5', cellA5);

                if (cellA5 === "sum(a1:a4)" && parseInt(answer, 10) === 10) {
                    setError(null);
                    setResult("Correct Answer! Well done.");
                } else {
                    setResult(null);
                    console.log('wrong answer');
                    setError("Incorrect Answer.");
                }
            } catch (err) {
                setAnswer(null);
                setError("Failed to process the uploaded file. Please ensure it is a valid .xlsx file.");
            }
        };
        reader.readAsArrayBuffer(uploadedFile);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={6}>
                    <h4>Excel Spreadsheet</h4>
                    <iframe width="602" height="346" frameborder="0" scrolling="no" src="https://onedrive.live.com/embed?resid=82C0DFA8B525C25F%21341&authkey=%21AGqCms2we7deqb0&em=2&wdAllowInteractivity=False&AllowTyping=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"></iframe>
                </Col>

                <Col md={6}>
                    <h4>Question & Answer</h4>
                    <p>{question}</p>
                    <Form>
                        <Form.Group controlId="answerInput">
                            <Form.Label>Your Answer</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="fileUpload" className="mt-3">
                            <Form.Label>Upload Your Solved Excel File</Form.Label>
                            <Form.Control type="file" accept=".xlsx" onChange={handleFileUpload} />
                        </Form.Group>

                        <Button
                            className="mt-3"
                            onClick={(e) => {
                                e.preventDefault();
                                validateSubmission();
                            }}
                        >
                            Submit
                        </Button>
                    </Form>

                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    {result && <Alert variant="success" className="mt-3">{result}</Alert>}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
