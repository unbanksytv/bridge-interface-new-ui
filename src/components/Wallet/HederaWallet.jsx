import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { connectHashpack } from "./ConnectWalletHelper";
import { hethers } from "@hashgraph/hethers";
import hashpack from "../../assets/img/wallet/hashpack.svg";

export default function HederaWallet({ wallet, close }) {
    const from = useSelector((state) => state.general.from);
    const temporaryFrom = useSelector((state) => state.general.temporaryFrom);
    const hederaAccount = useSelector((state) => state.general.hederaAccount);
    const testnet = useSelector((state) => state.general.testNet);
    const OFF = { opacity: 0.6, pointerEvents: "none" };

    const getStyle = () => {
        // switch (true) {
        //     case testnet:
        //         return {};
        //     case !testnet:
        //         return OFF;
        //     case temporaryFrom?.type === "Hedera" || from?.type === "Hedera":
        //         return {};
        //     case !temporaryFrom && !from:
        //         return {};
        //     default:
        //         return OFF;
        // }
        return { display: "none" };
    };

    const connectHandler = async (wallet) => {
        switch (wallet) {
            case "Hashpack":
                const connected = await connectHashpack();
                if (connected) close();
                break;
            default:
                break;
        }
    };

    switch (wallet) {
        case "Hashpack":
            return (
                <li
                    style={getStyle()}
                    onClick={() => connectHandler("Hashpack")}
                    className="wllListItem"
                    data-wallet="Hashpack"
                >
                    <img
                        style={{ width: "28px" }}
                        src={hashpack}
                        alt="Hashpack Icon"
                    />
                    <p>Hashpack</p>
                </li>
            );
        default:
            return (
                <li
                    style={getStyle()}
                    // onClick={() => connectHandler("MetaMask")}
                    className="wllListItem"
                    data-wallet="Blade"
                >
                    {/* <img src={MetaMask} alt="MetaMask Icon" /> */}
                    <p>Blade</p>
                </li>
            );
    }
}
