import React, { useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import { Web3Provider } from '@ethersproject/providers';
import {
    injected
} from './connectors';

const ConnectButton = () => {
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React();

    const [buttonText, setButtonText] = useState("Connect Wallet");
    const [isDisabled, setIsDisabled] = useState(false);

    const onClickConnect = async () => {
        try {
            setButtonText("Connecting...");
            setIsDisabled(true);

            await activate(injected);

            setIsDisabled(false);
        } catch (error) {
            setButtonText("Connect Wallet");
            setIsDisabled(false);
        }
    };

    return (
        <button
            disabled={isDisabled}
            onClick={onClickConnect}
            className="font-mont rounded-lg border-2 border-gray-300 py-2 px-3 text-base font-bold cursor-pointer"
        >
            {buttonText}
        </button>
    );
};

export default ConnectButton;