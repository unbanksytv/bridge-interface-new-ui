import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import {
    setSelectedNFTList,
    removeFromSelectedNFTList,
} from "../../store/reducers/generalSlice";
import NFTdetails from "./NFTdetails";
import { useSelector } from "react-redux";
import VideoAndImage from "./VideoAndImage";
import BrockenUtlGridView from "./BrockenUtlGridView";
import "./NewNFT.css";
import Preload from "./Preload";
import ClaimableCard from "./ClaimableCard";
import NotWhiteListed from "./NotWhiteListed";

import { parseNFT } from "../../wallet/nftParser";
import { useDidUpdateEffect } from "../Settings/hooks";
import Image from "./Image";
import SFTMark from "./SFTMark";

import OnlyVideo from "./OnlyVideo";
import { chains, chainsConfig } from "../values";
import OriginChainMark from "./OriginChainMark";

export default function NFTcard({ nft, index, claimables }) {
    const dispatch = useDispatch();
    const [detailsOn, setDetailsOn] = useState(false);
    const search = useSelector((state) => state.general.NFTListSearch);
    const factory = useSelector((state) => state.general.factory);
    const testnet = useSelector((state) => state.general.testNet);
    const selectedNFTs = useSelector((state) => state.general.selectedNFTList);
    const [isVisible, setIsVisible] = useState();
    const localhost = window.location.hostname;
    const [imageErr, setImageErr] = useState(false);

    const callBackWhenObserver = (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    const getOriginChain = (originChain) => {
        // debugger;
        const _nonce = originChain ? parseInt(originChain) : undefined;
        const origin = chains.find((e) => e.nonce === _nonce);
        return chainsConfig[origin?.text]?.img;
    };

    const originChainImg = getOriginChain(nft?.originChain);

    const cardRef = useRef(null);
    const options = useMemo(() => {
        return {
            root: null,
            tootMargin: "0px",
            threshold: 0.3,
        };
    }, []);

    let isSelected = selectedNFTs.filter(
        (n) =>
            n.native.tokenId === nft.native?.tokenId &&
            n.native.contract === nft.native?.contract &&
            n.native.chainId === nft.native?.chainId
    )[0];

    function addRemoveNFT(chosen) {
        if (!isSelected) {
            dispatch(setSelectedNFTList(chosen));
        } else {
            dispatch(removeFromSelectedNFTList(nft));
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            callBackWhenObserver,
            options
        );
        const currentTarget = cardRef.current;

        if (currentTarget) observer.observe(currentTarget);
        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [cardRef, options, search]);

    useDidUpdateEffect(() => {
        if (isVisible) {
            if (!nft.dataLoaded) {
                parseNFT(factory)(nft, index, testnet, claimables);
            }
        }
    }, [isVisible, nft]);

    return (
        <>
            <div className={`nft-box__wrapper`} ref={cardRef}>
                {!nft?.dataLoaded ? (
                    <Preload />
                ) : (
                    <div
                        onClick={() =>
                            nft.whitelisted && !detailsOn && !claimables
                                ? addRemoveNFT(nft, index)
                                : undefined
                        }
                        className={
                            nft.whitelisted
                                ? "nft__card--selected"
                                : "nft__card"
                        }
                    >
                        {nft.native?.amount && (
                            <SFTMark amount={nft?.native.amount} />
                        )}
                        {originChainImg && (
                            <OriginChainMark icon={originChainImg} />
                        )}
                        <div className="nft__main">
                            {nft.uri && nft.image && nft.animation_url ? (
                                <VideoAndImage
                                    index={index}
                                    videoUrl={nft.animation_url}
                                    imageUrl={nft.image}
                                    onError={setImageErr}
                                    nft={nft}
                                />
                            ) : nft.image && !imageErr ? (
                                <Image
                                    onError={setImageErr}
                                    nft={nft}
                                    index={index}
                                />
                            ) : !nft.image && nft.animation_url ? (
                                <OnlyVideo videoUrl={nft.animation_url} />
                            ) : (
                                <BrockenUtlGridView />
                            )}

                            {!claimables && nft.whitelisted ? (
                                !isSelected ? (
                                    <div className="nft-radio"></div>
                                ) : (
                                    <div className="nft-radio--selected"></div>
                                )
                            ) : (
                                ""
                            )}

                            {!nft.whitelisted /*|| !verifiedContract*/ && (
                                <NotWhiteListed />
                            )}
                            {claimables && (
                                <ClaimableCard nft={nft} index={index} />
                            )}
                        </div>
                        <div className="nft__footer">
                            {localhost === "localhost" && (
                                <span
                                    style={{
                                        fontSize: "10px",
                                        color: "red",
                                    }}
                                >
                                    index: {index}
                                </span>
                            )}
                            <span className="nft-name">
                                <span className="name">
                                    {nft.name || nft.native?.name}
                                </span>
                                <NFTdetails
                                    details={setDetailsOn}
                                    nftInf={nft}
                                    index={index}
                                    claimables={claimables}
                                />
                            </span>
                            <span className="nft-number">
                                {nft.native?.tokenId}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
