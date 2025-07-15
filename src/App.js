import React from "react";
import { useImmer } from "use-immer";
import "./assets/styles/styles.css";
import "./App.css";
import Answer from "./Answer";

export const App = () => {
    const [activeTab, setActiveTab] = useImmer("question");
    const handleTabClick = (tab) => {
        setActiveTab((draft) => {
            draft = tab;
            return draft;
        });
    };


    return (
        <>
            <div className="col-lg-8 mb-4 mb-lg-0 main-content">
                <div className="card tab-view-wrapper">
                    <div className="card-header border-0">
                        <div className="tab-header">
                            <div className="tabs d-flex align-items-center">
                                <div
                                    className={`tab ${activeTab === "question" ? "active" : ""}`}
                                    onClick={() => handleTabClick("question")}
                                >
                                    Question
                                </div>

                                <div
                                    className={`tab ${activeTab === "answer" ? "active" : ""}`}
                                    onClick={() => handleTabClick("answer")}
                                >
                                    Answer
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="tab-content-block">
                            <div>
                                <div
                                    className="tab-content tab-content-wrapper"
                                    style={{ display: activeTab === "question" ? "block" : "none" }}
                                >


                                    <h4><b>Question : You are requested to create a calculator</b></h4>
                                    <p>
                                        <strong>Description:</strong> A company owner needs to find each month profit / loss. All he has is the total cost of the month and selling price of the month.
                                    </p>

                                    <h4><b>Expected program need the following:</b></h4>
                                    <ul style={{ marginTop: "15px" }}>
                                        <li style={{ marginBottom: "10px" }}>Need to accept the month, cost and selling price</li>
                                        <li style={{ marginBottom: "10px" }}>Make sure entered month is valid else print "error"</li>
                                        <li style={{ marginBottom: "10px" }}>Expected Output: "For month April you have profit 100 which is 10 % "</li>
                                    </ul>

                                    <h4><b>Example:</b></h4>
                                    <p>For month april with 50000 cost and 60000 selling price.</p>
                                    <p><strong>Output:</strong> For month April you have profit 10000 which is 25 %.</p>

                                    <h4><b>Coding Platform structure:</b></h4>
                                    <p>Platform should inform student it is <strong>python3</strong></p>

                                    <h4><b>Test input set:</b></h4>
                                    <ul style={{ marginTop: "15px" }}>
                                        <li style={{ marginBottom: "10px" }}><strong>Input:</strong> Abc, 40000, 50000 → <strong>Output:</strong> error</li>
                                        <li style={{ marginBottom: "10px" }}><strong>Input:</strong> june, 40000, 50000 → <strong>Output:</strong> error</li>
                                        <li style={{ marginBottom: "10px" }}><strong>Input:</strong> jun, 40000, 50000 → <strong>Output:</strong> For month jun you have profit 10000 which is 25 %.</li>
                                    </ul>

                        

                                </div>
                            </div>
                            <div
                                className="tab-content"
                                style={{ display: activeTab === "ref" ? "block" : "none" }}
                            >
                                <div style={{ textAlign: "center" }}>
                                    <img src={require('./assets/img/Image-ref.png')} alt="Success" style={{ width: "550px", marginBottom: "40px", marginTop: "40px" }} />
                                </div>
                            </div>
                            <div
                                className="tab-content"
                                style={{ display: activeTab === "answer" ? "block" : "none" }}
                            >
                                <section className="tabele-layout">
                                    <Answer />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};