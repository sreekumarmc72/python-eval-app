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

  const QnData = [
    {
        "url": "https://1drv.ms/x/c/82c0dfa8b525c25f/IQRdKnO9W49oR7tEcI6kbSXHASSgD563xUJcD5wUixZgQrw?em=2&wdAllowInteractivity=False&AllowTyping=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True",
        "fields": [
          {
            "label": "A8 Cell value",
            "value": "8"
          },
          {
            "label": "D17 Cell value",
            "value": "200"
          },
          {
            "label": "D28 Cell value",
            "value": "250"
          },
          {
            "label": "C41 Cell value",
            "value": "320"
          }
        ],
        "cells": [
          {
            "name": "A8",
            "value": "5+3"
          },
          {
            "name": "D17",
            "value": "A17+B17+C17"
          },
          {
            "name": "D28",
            "value": "A28+B28+C28"
          },
          {
            "name": "C41",
            "value": "C36+C37+C38+C39+C40"
          },
          {
            "name": "C52",
            "value": "C47+C48+C49+C50+C51"
          },
          {
            "name": "A59",
            "value": "10-3"
          },
          {
            "name": "D65",
            "value": "B65-C65"
          },
          {
            "name": "D72",
            "value": "C72-B72"
          },
          {
            "name": "D73",
            "value": "C73-B73"
          },
          {
            "name": "D74",
            "value": "C74-B74"
          },
          {
            "name": "D75",
            "value": "C75-B75"
          },
          {
            "name": "D76",
            "value": "C76-B76"
          },
          {
            "name": "D77",
            "value": "D72+D73+D74+D75+D76"
          }
        ]
      },
    {
        "url": "https://1drv.ms/x/c/82c0dfa8b525c25f/UQRfwiW1qN_AIICCVwEAAAAAALAk6GouNyrWkwo?em=2&wdAllowInteractivity=False&AllowTyping=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True",
        "fields": [
          {
            "label": "E5 Total value",
            "value": "1400"
          },
          {
            "label": "E6 Total value",
            "value": "1020"
          },
          {
            "label": "E7 Total value",
            "value": "1908"
          },
          {
            "label": "Grant Total value",
            "value": "10039"
          }
        ],
        "cells": [
          {
            "name": "E5",
            "value": "A5+B5"
          },
          {
            "name": "E6",
            "value": "A6+B6"
          },
          {
            "name": "E7",
            "value": "A7+B7+C7"
          },
          {
            "name": "E8",
            "value": "A8+B8+C8"
          },
          {
            "name": "E9",
            "value": "A9+B9+C9+D9"
          },
          {
            "name": "E10",
            "value": "A10+B10+C10+D10"
          },
          {
            "name": "E11",
            "value": "E5+E6+E7+E8+E9+E10"
          }
        ]
      } ,
      {
        "url": "https://onedrive.live.com/embed?resid=82C0DFA8B525C25F%21345&authkey=%21AC7KV8TR7NJCKaI&em=2&wdAllowInteractivity=False&AllowTyping=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True",
        "fields": [
          {
            "label": "Total Income",
            "value": "550000"
          },
          {
            "label": "Total Expenses",
            "value": "330000"
          },
          {
            "label": "Net Profit/Loss",
            "value": "220000"
          }
        ],
        "cells": [
          {
            "name": "C9",
            "value": "C7+C8"
          },
          {
            "name": "C14",
            "value": "C10+C11+C12+C13"
          },
          {
            "name": "C15",
            "value": "C9-C14"
          }
        ]
      }    
  ];

  const urlParams = new URLSearchParams(window.location.search);
  const task = urlParams.get('task');
  const qn = task === 'task2' ? QnData[1] : QnData[0];

  console.log('qn', qn);

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
              <div
                className="tab-content"
                style={{ display: activeTab === "question" ? "block" : "none" }}
              >
                <div>
                  {/* <iframe
                    width="1202"
                    height="670"
                    style={{ marginLeft: "20px" }}
                    frameBorder="0"
                    scrolling="no"
                    src={qn.url}
                  ></iframe> */}

<iframe width="402" height="346" frameborder="0" scrolling="no" src="https://1drv.ms/x/c/82c0dfa8b525c25f/IQQFZz1w9rlmTqDnkohLHEudAaGnyWYYNdsFndAQSZENaX4?em=2&wdAllowInteractivity=False&AllowTyping=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"></iframe>
                </div>
              </div>
              <div
                className="tab-content"
                style={{ display: activeTab === "answer" ? "block" : "none" }}
              >
                <section className="tabele-layout">
                  <Answer  qn={qn}/>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
