//import Resolution from "@unstoppabledomains/resolution";
import axios from "axios";
import { CHAIN_INFO } from "../components/values";
import { setReceiver, setAccount } from "../store/reducers/generalSlice";
import store from "../store/store";
import { convertOne1 } from "../wallet/helpers";

const endings = [
    ".crypto",
    ".nft",
    ".wallet",
    ".blockchain",
    ".x",
    ".bitcoin",
    ".dao",
    ".888",
    ".zil",
];

export const getFromDomain = async (domain, to) => {
    const { type, key } = to;
    const currency = CHAIN_INFO[key].native;
    const dotExist = domain.lastIndexOf(".");
    if (dotExist === -1) return;
    const ending = domain.slice(domain.lastIndexOf("."), domain.length);
    const isUnstoppableDomain = endings.some((e) => e === ending);
    let address;
    if (isUnstoppableDomain && type !== "EVM") {
        return "notEVM";
    } else if (isUnstoppableDomain && type === "EVM") {
        const data = await fetchData(domain);
        const { records } = data;
        switch (currency) {
            case "MATIC":
                address = records[`crypto.MATIC.version.ERC20.address`];
                break;
            case "FTM":
                address = records[currency][`crypto.FTM.version.ERC20.address`];
                break;
            case "ONE":
                const add =
                    records[currency][`crypto.ONE.version.ERC20.address`];
                address = convertOne1(add);
                break;
            default:
                address = records[`crypto.${currency}.address`];
                break;
        }
    } else {
        return "invalid";
    }
    if (address) store.dispatch(setReceiver(address));

    return address || "undefined";
};

export const fetchData = async (domain) => {
    var config = {
        method: "get",
        url:
            "https://resolve.unstoppabledomains.com/domains/rodiong-xpnetwork.blockchain",
        headers: {
            Authorization: `Bearer ${process.env.REACT_APP_UNSTOP_BARER}`,
        },
    };

    try {
        const { data } = await axios(config);

        return data;
    } catch (error) {
        console.log(error);
    }
};
