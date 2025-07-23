import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomView.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button } from "react-bootstrap";
import config from './config';

// Safe render function to prevent object rendering
const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
        console.error('Attempting to render object:', value);
        return JSON.stringify(value);
    }
    return String(value);
};

const Answer = () => {
    // Initial state contains only the calculate_profit function template
    const [code, setCode] = useState(`def calculate_profit(month, cost, selling_price):
    """
    calculate profit based on month and cost
    1. need to print the output from here after calculation
    2. if month is not valid print error
    expected month values: 'jan', 'feb', 'mar', 'apr', 'may',
    'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    """
    pass`);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [failedCases, setFailedCases] = useState([]);
    const [malpracticeCount, setMalpracticeCount] = useState(0);
    const [showMalpracticeModal, setShowMalpracticeModal] = useState(false);
    const [malpracticeMessage, setMalpracticeMessage] = useState("");
    const [focusLossCount, setFocusLossCount] = useState(0);
    const [showFocusWarningModal, setShowFocusWarningModal] = useState(false);

    // Debug: Log what we're actually rendering
    console.log('Component rendered with:', {
        code: typeof code,
        showModal: typeof showModal,
        errorMessage: typeof errorMessage,
        errorMessageValue: errorMessage,
        failedCases: failedCases,
        malpracticeCount: malpracticeCount,
        showMalpracticeModal: showMalpracticeModal,
        focusLossCount: focusLossCount,
        showFocusWarningModal: showFocusWarningModal
    });

    // Additional check - ensure we're not accidentally setting an object
    useEffect(() => {
        console.log('Error message changed:', errorMessage, typeof errorMessage);
        console.log('Failed cases updated:', failedCases);
    }, [errorMessage, failedCases]);

    // Set up malpractice prevention and focus loss tracking
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (focusLossCount === 0) {
                    setShowFocusWarningModal(true);
                } else if (focusLossCount === 1) {
                    setErrorMessage("App has been terminated due to multiple focus losses.");
                    setFailedCases([]);
                    setMalpracticeCount(3);
                    setShowFocusWarningModal(false);
                }
            } else {
                if (focusLossCount === 0 && showFocusWarningModal) {
                    setFocusLossCount(1); // Increment after first warning is shown
                }
            }
        };

        const handleBeforeUnload = (e) => {
            if (malpracticeCount < 1) {
                e.preventDefault();
                setMalpracticeMessage("Closing the window is not allowed during the test. This is your warning #1. Next attempt will terminate the test.");
                setShowMalpracticeModal(true);
                setMalpracticeCount((prev) => prev + 1);
                e.returnValue = ""; // Required for some browsers
            } else {
                setErrorMessage("Test terminated due to window close attempt.");
                setFailedCases([]);
                setMalpracticeCount(3);
            }
        };

        const handleCopyPaste = (e) => {
            e.preventDefault(); // Silently block copy-paste without popup
        };

        const handleContextMenu = (e) => {
            e.preventDefault(); // Silently block right-click without popup
        };

        const handleKeyDown = (e) => {
            if ((e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'F12') {
                e.preventDefault();
                setMalpracticeMessage(`Dev tools access is disabled. This is your warning #${malpracticeCount + 1}. Next will terminate the test.`);
                setShowMalpracticeModal(true);
                if (malpracticeCount < 2) {
                    setMalpracticeCount((prev) => prev + 1);
                } else {
                    setErrorMessage("Test terminated due to dev tools access attempt.");
                    setFailedCases([]);
                    setMalpracticeCount(3);
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
       /*  document.addEventListener("copy", handleCopyPaste);
        document.addEventListener("cut", handleCopyPaste);
        document.addEventListener("paste", handleCopyPaste); */
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("copy", handleCopyPaste);
            document.removeEventListener("cut", handleCopyPaste);
            document.removeEventListener("paste", handleCopyPaste);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [malpracticeCount, focusLossCount, showFocusWarningModal]);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        console.log('Code changed to:', typeof newCode, newCode.length);
        setCode(newCode);
        setErrorMessage("");
        setFailedCases([]);
        setMalpracticeCount(0);
        setShowMalpracticeModal(false);
        setFocusLossCount(0);
        setShowFocusWarningModal(false);
    };

    const validateCode = () => {
        if (code.includes("pass")) {
            setErrorMessage("Please implement the calculate_profit function.");
            setFailedCases([]);
            return false;
        }
        return true;
    };

    const handleValidateButton = async () => {
        if (malpracticeCount >= 3 || !validateCode()) return;

        // Define test cases
        const testCases = [
            { inputs: ["Abc", 40000, 50000], expected: "error" },
            { inputs: ["june", 40000, 50000], expected: "error" },
            { inputs: ["jun", 40000, 50000], expected: "For month jun you have profit 10000 which is 25 %." }
        ];

        const newFailedCases = [];

        for (let i = 0; i < testCases.length; i++) {
            const { inputs, expected } = testCases[i];
            const [month, cost, selling_price] = inputs;

            // Construct the full script for this test case
            const fullScript = `
${code}

if __name__ == "__main__":
    month = "${month}"
    cost = float("${cost}")
    selling_price = float("${selling_price}")
    calculate_profit(month, cost, selling_price)
`;

            try {
                const response = await fetch(config.pythonApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: fullScript }),
                });

                const data = await response.json();
                console.log(`API Response for test case ${i + 1}:`, data);

                if (!response.ok) {
                    newFailedCases.push({
                        inputs,
                        expected,
                        received: `API Error: ${data.error || 'Unknown error'}`
                    });
                    continue;
                }

                if (!data.output) {
                    newFailedCases.push({
                        inputs,
                        expected,
                        received: 'No output received'
                    });
                    continue;
                }

                let receivedOutput;
                try {
                    receivedOutput = typeof data.output === 'string' ? data.output.trim() : String(data.output).trim();
                    if (receivedOutput !== expected) {
                        newFailedCases.push({
                            inputs,
                            expected,
                            received: receivedOutput
                        });
                    }
                } catch (parseError) {
                    console.error(`Parse Error for test case ${i + 1}:`, parseError);
                    newFailedCases.push({
                        inputs,
                        expected,
                        received: 'Invalid output format'
                    });
                }
            } catch (error) {
                console.error(`Error for test case ${i + 1}:`, error);
                newFailedCases.push({
                    inputs,
                    expected,
                    received: 'Failed to connect to validation service'
                });
            }
        }

        setFailedCases(newFailedCases);
        setShowModal(newFailedCases.length === 0 && malpracticeCount < 3);
        setErrorMessage(newFailedCases.length > 0 ? `Validation failed for ${newFailedCases.length} test case(s):` : (malpracticeCount >= 3 ? errorMessage : ""));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessage("");
        setFailedCases([]);
        setMalpracticeCount(0);
        setShowMalpracticeModal(false);
        setFocusLossCount(0);
        setShowFocusWarningModal(false);
        setCode(`def calculate_profit(month, cost, selling_price):
    """
    calculate profit based on month and cost
    1. need to print the output from here after calculation
    2. if month is not valid print error
    expected month values: 'jan', 'feb', 'mar', 'apr', 'may',
    'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    """
    pass`);
    };

    const handleMalpracticeContinue = () => {
        setShowMalpracticeModal(false);
        if (malpracticeCount >= 3) {
            setErrorMessage(malpracticeMessage);
        }
    };

    const handleFocusWarningContinue = () => {
        setShowFocusWarningModal(false);
        if (focusLossCount === 0) {
            setFocusLossCount(1);
        }
    };

    return (
        <div>
            <div className="container answer-block">
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div
                            className="input-field code-editor"
                            style={{
                                backgroundColor: '#f8f9fa',
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                                width: "100%",
                                textAlign: "left"
                            }}
                        >
                            <pre>
                                <code>
                                    <textarea
                                        style={{
                                            width: "100%",
                                            height: "400px",
                                            resize: "vertical",
                                            border: "none",
                                            outline: "none",
                                            fontFamily: "'Consolas', 'Courier New', monospace",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                            padding: "10px",
                                            backgroundColor: "#fff",
                                            color: "#333",
                                            borderRadius: "4px",
                                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
                                        }}
                                        value={safeRender(code)}
                                        onChange={handleCodeChange}
                                    />
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
                <div className="row error-area">
                    {errorMessage && (failedCases.length > 0 || malpracticeCount >= 3) && (
                        <div style={{color: "#B52556", fontWeight: "bold", padding: "10px", backgroundColor: "#FCE8F1", borderRadius: "5px", margin: "10px 0", whiteSpace: "pre-wrap"}}>
                            <p style={{color: "#932121"}}>{errorMessage}</p>
                            {failedCases.length > 0 && (
                                <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc" }}>
                                    {failedCases.map((c, i) => (
                                        <li key={i} style={{ color: "#C54D6F", margin: "5px 0" }}>
                                            Test Case {i + 1}: Inputs={c.inputs.join(', ')}, Expected="{c.expected}", Received="{c.received}"
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Section with Validate Button */}
            <div className="bottom-section" style={{ backgroundColor: errorMessage ? '#FCE8F1' : '#fff' }}>
                <div className="errors-found">
                    {errorMessage && (
                        <div>
                            {/* Temporarily comment out image to test if this is the issue */}
                            {/* <img src={require('./error.png')} alt="Warning" style={{ width: "30px", marginRight: "13px" }} /> */}
                            <span>Errors found!</span>
                        </div>
                    )}
                </div>
                <div className="col text-right">
                    <button
                        className="validate-btn"
                        onClick={handleValidateButton}
                        disabled={malpracticeCount >= 3}
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

            {/* Malpractice Warning Modal */}
            <Modal show={showMalpracticeModal} onHide={handleMalpracticeContinue} centered>
                <Modal.Body style={{ backgroundColor: "#FCE8F1", padding: "20px", color: "#B52556", textAlign: "center" }}>
                    <p style={{ fontWeight: "bold", fontSize: "18px" }}>{malpracticeMessage}</p>
                    <Button
                        className="done-btn mt-3"
                        onClick={handleMalpracticeContinue}
                        style={{ backgroundColor: "#B52556", color: "#fff", border: "none" }}
                    >
                        Continue
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Focus Warning Modal */}
            <Modal show={showFocusWarningModal} onHide={handleFocusWarningContinue} centered>
                <Modal.Body style={{ backgroundColor: "#FCE8F1", padding: "20px", color: "#B52556", textAlign: "center" }}>
                    <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Warning: Moving to another application/tab is not allowed. This is your first warning. Next time will terminate the test.
                    </p>
                    <Button
                        className="done-btn mt-3"
                        onClick={handleFocusWarningContinue}
                        style={{ backgroundColor: "#B52556", color: "#fff", border: "none" }}
                    >
                        Continue
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Answer;