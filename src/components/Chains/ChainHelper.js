import { CHAIN_INFO } from "../../components/values";

export const checkIfLive = (chain, validatorsInfo) => {
    // debugger;
    const nonce = CHAIN_INFO[chain]?.nonce;
    if (validatorsInfo) {
        return validatorsInfo[nonce]?.bridge_alive;
    }
};

export const filterChains = (arr, extraChain) => {
    return arr.filter((chain) => chain.text !== extraChain);
};
