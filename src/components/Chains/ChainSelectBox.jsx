import { useDispatch } from "react-redux";
import {
    setTo,
    setFrom,
    setChangeWallet,
    setKeplrAccount,
    setKeplrWallet,
    setTemporaryFrom,
    setTemporaryTo,
} from "../../store/reducers/generalSlice";
import { useSelector } from "react-redux";
import SetDeparture from "./SetDeparture";
import SetDestination from "./SetDestination";
import ChainListBox from "./ChainListBox";
import swap from "../../assets/img/icons/swapChain.svg";
import { usePrevious } from "../Settings/hooks";
import { switchNetwork } from "../../services/chains/evm/evmService";

export default function ChainSelectBox() {
    const dispatch = useDispatch();
    const from = useSelector((state) => state.general.from);
    const prevSelected = usePrevious(from);
    const to = useSelector((state) => state.general.to);
    const account = useSelector((state) => state.general.account);
    const algorandAccount = useSelector(
        (state) => state.general.algorandAccount
    );
    const secretAccount = useSelector((state) => state.general.secretAccount);

    const tezosAccount = useSelector((state) => state.general.tezosAccount);
    const elrondAccount = useSelector((state) => state.general.elrondAccount);
    const tronWallet = useSelector((state) => state.general.tronWallet);
    const testnet = useSelector((state) => state.general.testNet);

    const switchChains = (e) => {
        if (from.type !== to.type) {
            switch (from.type) {
                case "Hedera":
                    if (account) {
                        //TODO
                    } else handleSwitch(e);
                    break;
                case "EVM":
                    if (account) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                case "Tron":
                    if (tronWallet) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setTo(""));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                case "Elrond":
                    if (elrondAccount) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                case "Tezos":
                    if (tezosAccount) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                case "VeChain":
                    if (account) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                case "Algorand":
                    if (algorandAccount) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                case "Cosmos":
                    if (secretAccount) {
                        dispatch(setTemporaryFrom(to));
                        dispatch(setTemporaryTo(from));
                        dispatch(setChangeWallet(true));
                    } else handleSwitch(e);
                    break;
                default:
                    break;
            }
        } else {
            handleSwitch(e);
        }
    };

    const handleSwitch = async (e) => {
        // debugger
        e.preventDefault();
        const temp = to;
        let success;
        if (account) {
            success = await switchNetwork(temp);
            if (success) {
                dispatch(setTo(from));
                dispatch(setFrom(temp));
            }
        } else {
            dispatch(setTo(from));
            dispatch(setFrom(temp));
        }
    };

    return (
        <>
            <ChainListBox switchNetwork={switchNetwork} />
            <div className="chain-select__box">
                Transfer NFTs
                <br /> between blockchains
            </div>
            <div className="nftSelectBox">
                <SetDeparture />
                <span
                    className="swap-chain__btn"
                    onClick={(e) => (from && to ? switchChains(e) : undefined)}
                >
                    <img src={swap} alt="" />
                </span>
                <span className="chain-sep__line"></span>
                <SetDestination />
            </div>
        </>
    );
}
