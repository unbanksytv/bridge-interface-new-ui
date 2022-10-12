import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { checkIfLive } from "./ChainHelper";
import "./Chain.css";
import { useState } from "react";
import Status from "./Status";
import { useLocation } from "react-router-dom";

export default function Chain(props) {
    const {
        filteredChain,
        chainSelectHandler,
        text,
        image,
        coming,
        newChain,
        chainKey,
        maintenance,
        updated,
    } = props;
    const validatorsInfo = useSelector((state) => state.general.validatorsInfo);
    const testnet = useSelector((state) => state.general.testNet);
    const to = useSelector((state) => state.general.to);
    const from = useSelector((state) => state.general.from);
    const OFF = { opacity: 0.6, pointerEvents: "none" };
    const NONE = { display: "none" };
    const [chainStatus, setChainStatus] = useState(undefined);
    const location = useLocation();

    useEffect(() => {
        if (testnet) return setChainStatus(true);
        setChainStatus(checkIfLive(chainKey, validatorsInfo));
    }, [validatorsInfo]);

    const algoStyle = {};

    const getStyle = () => {
        if (
            maintenance ||
            maintenance ||
            (location.pathname.includes("testnet")
                ? false
                : !checkIfLive(chainKey, validatorsInfo)) ||
            coming
        ) {
            return OFF;
        } else if (
            (location.pathname === "/testnet/account" ||
                location.pathname === "/account" ||
                location.pathname === "/" ||
                location.pathname.includes("testnet")) &&
            from?.text === text &&
            from.type !== "EVM"
        ) {
            return NONE;
        } else if (
            (location.pathname === "/testnet/connect" ||
                location.pathname === "/connect" ||
                location.pathname === "/" ||
                location.pathname.includes("testnet")) &&
            text === from?.text
        ) {
            return NONE;
        } else return {};
    };

    return (
        <li
            style={getStyle()}
            onClick={() => chainSelectHandler(filteredChain)}
            className="nftChainItem"
            data-chain={text}
        >
            <img
                className="modalSelectOptionsImage"
                src={image.src}
                alt={text}
            />
            <div className="modalSelectOptionsText">
                {text === "xDai" ? "Gnosis" : text}
                <div className="chain--identifier">
                    {chainStatus === undefined && !coming && !maintenance ? (
                        <Status status={"connecting"} />
                    ) : (
                        !chainStatus &&
                        !coming &&
                        !maintenance && <Status status={"off-line"} />
                    )}
                    {coming && <Status status={"coming"} />}
                    {maintenance && <Status status={"maintenance"} />}
                    {updated && <Status status={"updated"} />}
                    {!maintenance && newChain && <Status status={"new"} />}
                </div>
            </div>
        </li>
    );
}
