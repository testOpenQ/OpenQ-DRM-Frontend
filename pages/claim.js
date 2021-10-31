import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import StoreContext from "../store/Store/StoreContext";
import useAuth from "../hooks/useAuth";
import { useWeb3React } from '@web3-react/core';

function Claim() {
    const [issueUrl, setIssueUrl] = useState("https://github.com/OpenQDev/OpenQ-Contracts/issues/48");
    const [appState, setAppState] = useContext(StoreContext);
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

    useAuth();

    const claimBounty = async (event) => {
        event.preventDefault();
        axios.post(`${appState.oracleBaseUrl}/claim`, {
            issueUrl,
            payoutAddress: account
        }, { withCredentials: true })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                switch (error.response.data.type) {
                    case "NO_GITHUB_OAUTH_TOKEN":
                        alert("You must sign into GitHub to claim a bounty.");
                        break;
                    case "ISSUE_IS_CLAIMED":
                        alert("This issue has already been claimed.");
                        break;
                    case "NOT_FOUND":
                        alert("NOT_FOUND");
                        break;
                    case "NOT_CLOSED":
                        alert("NOT_CLOSED");
                        break;
                    case "INVALID_OAUTH_TOKEN":
                        alert("INVALID_OAUTH_TOKEN");
                        break;
                    case "ISSUE_NOT_CLOSED_BY_USER":
                        alert("ISSUE_NOT_CLOSED_BY_USER");
                        break;
                    case "UNKNOWN_ERROR":
                        alert("UNKNOWN_ERROR");
                        break;
                    default:
                        alert("Uncaught error");
                }
            });
    };

    return (
        <div className="font-mont bg-gray-100 font-normal text-gray-600">
            <form onSubmit={(event) => claimBounty(event)}>
                <input
                    className="bg-gray-100 w-6/7 border-gray-100 outline-none"
                    id="name"
                    placeholder="https://github.com/OpenQDev/frontend/issues/3"
                    type="text"
                    value={issueUrl}
                    onChange={(event) => setIssueUrl(event.target.value)}
                />
                <button type="submit">Claim</button>
            </form>
        </div>
    );
}

export default Claim;
