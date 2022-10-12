import { checkIfJSON, getFactory } from "../../wallet/helpers";
import { CHAIN_INFO } from "../values";
const supportedVideoFormats = [".mp4", ".ogg", ".webm", ".avi"];
const supportedImageFormats = [
  ".apng",
  ".gif",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webp",
];

const ifVideo = (item) => {
  const f =
    item.slice(item.lastIndexOf(".")).length < 6 &&
    item.slice(item.lastIndexOf(".")).length > 3
      ? item.slice(item.lastIndexOf("."))
      : undefined;
  return supportedVideoFormats.some((e) => e === f) ? true : false;
};
const ifImage = (item) => {
  const f =
    item.slice(item.lastIndexOf(".")).length < 6 &&
    item.slice(item.lastIndexOf(".")).length > 3
      ? item.slice(item.lastIndexOf("."))
      : undefined;
  return supportedImageFormats.some((e) => e === f) ? true : false;
};

export const getUrl = (nft) => {
  let video = false;
  let videoUrl = false;
  let image = false;
  let imageUrl = false;
  const values = Object.values(nft);
  let valuesForCheck = [];
  let strings = [];
  let urls = [];
  let ipfsArr = [];
  let url;

  // debugger
  values.forEach((item) => {
    if (item && typeof item === "object") {
      const objValues = Object.values(item);
      if (objValues.some((e) => e && typeof e === "object")) {
        objValues.forEach((e) => {
          if (e && typeof e === "object") {
            const eValues = Object.values(e);
            valuesForCheck.push(...eValues);
          } else valuesForCheck.push(e);
        });
      }
      valuesForCheck.push(...objValues);
    } else valuesForCheck.push(item);
  });

  valuesForCheck.forEach((item) => {
    if (item && typeof item === "string" && item.length > 1) {
      strings.push(item);
    } else if (item && typeof item === "object") {
      // debugger
      const vals = Object.values(item);
      vals.forEach((item) => {
        if (typeof item === "string" && item.length > 1) {
          strings.push(item);
        }
      });
    }
  });
  strings.forEach((item) => {
    if (
      (item.includes("https:") ||
        item.includes("ipfs") ||
        item.includes("base64")) &&
      !item.includes(".json")
    ) {
      urls.push(item);
    }
  });
  if (urls.some((item) => ifVideo(item))) {
    urls.forEach((e) => {
      if (ifVideo(e)) {
        video = true;
        videoUrl = e;
      }
    });
  }
  if (urls.some((item) => ifImage(item))) {
    urls.forEach((e) => {
      if (ifImage(e)) {
        image = true;
        imageUrl = e;
      }
    });
  } else {
    ipfsArr = [...urls];
  }
  return { video, videoUrl, image, imageUrl, ipfsArr };
};

export const isShown = (search, nft) =>
  !search ||
  nft?.description
    ?.toString()
    .toLowerCase()
    .includes(search?.toLowerCase()) ||
  nft?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
  nft?.native?.owner?.includes(search?.toLowerCase()) ||
  nft?.native?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
  nft?.native?.meta?.token?.metadata?.collectionName
    ?.toLowerCase()
    .includes(search?.toLowerCase()) ||
  nft?.native?.meta?.token?.metadata?.name
    ?.toLowerCase()
    .includes(search?.toLowerCase()) ||
  nft?.native?.meta?.token?.metadata?.description
    ?.toLowerCase()
    .includes(search?.toLowerCase());

export const isWhiteListed = async (from, nft) => {
  try {
    let whitelisted;
    const chainNonce = CHAIN_INFO[from].nonce;

    const factory = await getFactory().catch((e) => console.log(e));
    const inner = await factory.inner(chainNonce).catch((e) => console.log(e));
    if (inner) {
      try {
        whitelisted = await factory.checkWhitelist(inner, nft);
      } catch (error) {
        whitelisted = await new Promise((resolve, reject) => {
          setTimeout(async () => {
            const status = await isWhiteListed(from.text, nft).catch(() =>
              reject(undefined)
            );
            resolve(status);
          }, 4000);
        });

        console.error("isWhiteListed: ", error);
      }
    }
    return whitelisted;
  } catch (e) {
    console.log(e);
  }
};
