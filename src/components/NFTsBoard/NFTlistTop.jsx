import { useDispatch } from "react-redux";
import {
    allSelected,
    setNFTsListView,
    cleanSelectedNFTList,
    setChainModal,
    setDepartureOrDestination,
    setWhitelistedNFTs,
} from "../../store/reducers/generalSlice";
import { useSelector } from "react-redux";
import { setNFTS } from "../../wallet/helpers";
import ChainListBox from "../Chains/ChainListBox";
import NFTSearch from "./NFTSearch";
import ChainSwitch from "../Buttons/ChainSwitch";
import Refresh from "../Buttons/Refresh";
import SelectedNFTs from "../Buttons/SelectedNFTs";
import ViewButton from "../Buttons/ViewButton";
import { ReactComponent as Check } from "../../assets/img/icons/gray_check.svg";
import ImportNFTButton from "../Buttons/ImportNFTButton";
import { useEffect } from "react";

function NFTlistTop() {
    const dispatch = useDispatch();
    const nfts = useSelector((state) => state.general.NFTList);
    const currentsNFTs = useSelector((state) => state.general.currentsNFTs);
    const from = useSelector((state) => state.general.from);
    const onlyWhiteListedNFTs = currentsNFTs?.filter((n) => n.whitelisted);
    const selectedNFTs = useSelector((state) => state.general.selectedNFTList);
    const OFF = { opacity: 0.6, pointerEvents: "none" };

    const handleFromChainSwitch = () => {
        dispatch(setDepartureOrDestination("departure"));
        dispatch(setChainModal(true));
    };

    return (
        <>
            <div className="yourNft--mobile">
                <span className="yourNft__title">Your NFTs on </span>
                {/* <Refresh /> */}
                <ChainSwitch assignment={"from"} />
            </div>
            <div className="nftListTop">
                <ChainListBox />
                <div className="yourNft desktopOnly">
                    <div className="yourNft__title">Your NFTs on</div>
                    <ChainSwitch
                        assignment={"from"}
                        func={handleFromChainSwitch}
                    />
                    <Refresh />
                </div>
                <SelectedNFTs />
                {from.type === "EVM" && nfts?.length < 1 && <ImportNFTButton />}
                {(nfts?.length > 0 || from?.type === "Cosmos") && (
                    <div className="nftTopRIght">
                        <NFTSearch />
                        {(from.type === "EVM" || from?.type !== "Cosmos") && (
                            <ImportNFTButton />
                        )}
                        <ViewButton />
                        {/* {onlyWhiteListedNFTs?.length === selectedNFTs?.length &&
                        selectedNFTs?.length ? (
                            <div
                                className="delete-all"
                                onClick={() => dispatch(cleanSelectedNFTList())}
                            >
                                {" "}
                                <Check className="svgWidget" />
                            </div>
                        ) : (
                            <div
                                style={currentsNFTs ? {} : OFF}
                                onClick={() => dispatch(allSelected())}
                                className="select-all"
                            >
                                <Check className="svgWidget" />
                            </div>
                        )} */}
                    </div>
                )}
            </div>
        </>
    );
}

export default NFTlistTop;
