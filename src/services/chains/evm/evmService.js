import {
    TESTNET_CHAIN_INFO,
    CHAIN_INFO,
    chainsConfig,
} from "../../../components/values.js";
import store from "../../../store/store.js";
import { errorToLog, getFactory } from "../../../wallet/helpers";
import { setError, setTxnHash } from "../../../store/reducers/generalSlice";
import BigNumber from "bignumber.js";
import { getAddEthereumChain } from "../../../wallet/chains.js";
import { patchRealizedDiscount } from "../../deposits.js";

export async function switchNetwork(chain) {
    // debugger;
    const {
        general: { testNet, bitKeep },
    } = store.getState();

    const id = (testNet ? chain.tnChainId : chain.chainId).toString();
    const paramsArr = getAddEthereumChain(testNet, id);

    const params = paramsArr[id];

    const copyParams = {
        chainName: params.name,
        chainId: `0x${params.chainId.toString(16)}`,
        nativeCurrency: params.nativeCurrency,
        rpcUrls: params.rpcUrls,
    };

    const info = testNet
        ? TESTNET_CHAIN_INFO[chain?.key]
        : CHAIN_INFO[chain?.key];

    const chainId = `0x${info.chainId.toString(16)}`;
    switch (true) {
        case bitKeep:
            try {
                await window.bitkeep.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: chainId }],
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        default:
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId }],
                });
                return true;
            } catch (error) {
                // const c = testNet ? chain?.tnChainId : chain?.chainId;
                console.log("birma");
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [copyParams],
                });
                console.log(error);
                return false;
            }
    }
}

export const approveForEVM = async () => {};

export const transferNFTFromEVM = async ({
    to,
    from,
    nft,
    signer,
    receiver,
    fee,
    index,
    txnHashArr,
    chainConfig,
    testnet,
    discountLeftUsd,
}) => {
    fee = discountLeftUsd ? fee - fee * 0.25 : fee;
    const factory = await getFactory();
    const toChain = await factory.inner(chainsConfig[to.text].Chain);
    const fromChain = await factory.inner(chainsConfig[from.text].Chain);
    const fromNonce = CHAIN_INFO[from.text].nonce;
    const toNonce = CHAIN_INFO[to.text].nonce;
    const wrapped = await factory.isWrappedNft(nft, fromNonce);

    const {
        native: { contract, tokenId },
        amountToTransfer,
    } = nft;
    const {
        general: { account },
    } = store.getState();
    let mintWith;
    if (!wrapped) {
        mintWith = await factory.getVerifiedContract(
            contract,
            toNonce,
            fromNonce,
            tokenId && !isNaN(Number(tokenId)) ? tokenId.toString() : undefined
        );
    }

    let result;

    switch (true) {
        case to.type === "Cosmos" && !mintWith && !wrapped:
            const contractAddress =
                chainConfig?.secretParams?.bridge?.contractAddress;
            const codeHash = chainConfig?.secretParams?.bridge?.codeHash;
            let mw = `${contractAddress},${codeHash}`;
            result = await factory.transferNft(
                fromChain,
                toChain,
                nft,
                signer,
                receiver,
                fee,
                mw
            );
            break;
        /*case !wrapped &&
      !mintWith &&
      !testnet &&
      (to.key === "Elrond" || to.type === "EVM"):
      store.dispatch(
        setError({
          message:
            "Transfer has been canceled. The NFT you are trying to send will be minted with a default NFT collection",
        })
      );
      if (txnHashArr[0]) {
        store.dispatch(setTxnHash({ txn: "failed", nft }));
      }
      break;*/
        default:
            result = await transfer(
                fromChain,
                toChain,
                nft,
                signer,
                receiver,
                amountToTransfer,
                fee,
                mintWith,
                factory,
                account
            );
            break;
    }
    if (result) patchRealizedDiscount(account, fee * 0.25);
    return result || false;
};

const transfer = async (
    fromChain,
    toChain,
    nft,
    signer,
    receiver,
    amount,
    fee,
    mintWith,
    factory,
    account
) => {
    let result;
    const {
        general: { from, to },
    } = store.getState();
    try {
        switch (true) {
            case amount > 0:
                result = await factory.transferSft(
                    fromChain,
                    toChain,
                    nft,
                    signer,
                    receiver,
                    new BigNumber(amount),
                    fee,
                    mintWith
                );
                return result;
            default:
                result = await factory.transferNft(
                    fromChain,
                    toChain,
                    nft,
                    signer,
                    receiver,
                    fee,
                    mintWith
                );
                return result;
        }
    } catch (error) {
        store.dispatch(setError(error));
        const date = new Date();
        const errBogy = {
            type: "Transfer",
            walletAddress: account,
            time: date.toString(),
            fromChain: from.text,
            toChain: to.text,
            message: error,
            nfts: nft.native,
        };
        errorToLog(errBogy);
    }
};
