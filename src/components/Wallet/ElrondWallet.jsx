import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Elrond from "../../assets/img/wallet/Elrond.svg";
import Maiar from "../../assets/img/wallet/Maiar.svg";
import { connectMaiar, connectMaiarExtension } from "./ConnectWalletHelper";
import { algoConnector } from "../../wallet/connectors";
import {
  setAlgorandAccount,
  setAlgorandWallet,
} from "../../store/reducers/generalSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function ElrondWallet({ wallet, close }) {
  const OFF = { opacity: 0.6, pointerEvents: "none" };
  const from = useSelector((state) => state.general.from);
  const temporaryFrom = useSelector((state) => state.general.temporaryFrom);
  const to = useSelector((state) => state.general.to);
  const testnet = useSelector((state) => state.general.testNet);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const truePathname =
    location.pathname === "/" ||
    location.pathname === "/connect" ||
    location.pathname === "/testnet/connect";
  const query = window.location.search || "";

  const handleConnect = async (wallet) => {
    switch (wallet) {
      case "Maiar":
        connectMaiar();
        break;
      case "Maiar Extension":
        const connected = await connectMaiarExtension();
        close();
        if (connected && to) navigateToAccountRoute();
        break;
      default:
        break;
    }
  };

  const navigateToAccountRoute = () => {
    navigate(testnet ? `/testnet/account${query}` : `/account${query}`);
  };

  useEffect(() => {
    algoConnector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts } = payload.params[0];
      if (accounts) {
        dispatch(setAlgorandWallet(true));
        dispatch(setAlgorandAccount(accounts[0]));
        if (to) navigateToAccountRoute();
      }
    });
  }, []);

  const getStyle = () => {
    if (temporaryFrom?.type === "Elrond") {
      return {};
    } else if (temporaryFrom && temporaryFrom?.type !== "Elrond") {
      return OFF;
    } else if (!from) {
      return {};
    } else if (from && from.text === "Elrond") {
      return {};
    } else return OFF;
  };

  return wallet === "Maiar" ? (
    <li
      style={getStyle()}
      onClick={() => handleConnect("Maiar")}
      className="wllListItem"
      data-wallet="Maiar"
    >
      <img src={Maiar} alt="" />
      <p>Maiar</p>
    </li>
  ) : (
    <li
      style={getStyle()}
      onClick={() => handleConnect("Maiar Extension")}
      className="wllListItem"
      data-wallet="MaiarExtension"
    >
      <img src={Elrond} alt="Elrond Icon" />
      <p>Maiar Extension</p>
    </li>
  );
}
