import { createSlice } from "@reduxjs/toolkit";
import image01 from '../../assets/img/slider/1.jpeg'
import image02 from '../../assets/img/slider/2.gif'
import image03 from '../../assets/img/slider/3.png'
import image04 from '../../assets/img/slider/4.png'
import image5 from '../../assets/img/slider/5.jpeg'



const initialState = {
    nfts:[
    {
        image:  image01,
        name: "Tales of Ragnarok Avatar #23849",
        description: "Tales of Ragnarok Avatar — NFT generative art for every player with utility use-cases in Tales of Ragnarok ecosystem such as profile, exclusive access, and future add-on integrated with the game and metaverse!",
        collection: "https://tofunft.com/collection/tales-of-ragnarok-avatar/items",
        progWidth: 0,
        action: false
    },
    {
      image:  image02,
      name: "MachineFi NFT",
      description: undefined,
      collection: undefined,
      progWidth: 0,
      action: false
    },
    {
      image:  image03,
      name: "Velas Punks #9582",
      description: "Velas Punks is the first NFT collection of 10,777 Vpunks on the Velas blockchain.",
      collection: "https://velaspunks-collection.vercel.app/",
      progWidth: 0,
      action: false
    },
    {
      image:  image04,
      name: "Innovator #494",
      description: "",
      collection: "https://trust.market/collection/INNOVATOR-fca3a7",
      progWidth: 0,
      action: false
    },
    {
      image:  image5,
      name: "Unidonkey",
      description: "The Unidonkey is quite skittish and reserved, but there is much power in their potential. Adored by even the smallest of hearts, its canter gives a calm rhythm to all eyes and ears.",
      collection: "https://opensea.io/collection/polychainmonsters",
      progWidth: 0,
      action: false
    }
  ],
    step: 0,
    position: 0
};

initialState.progWidth = initialState.nfts.map(n => 0)

const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    setStep(state, action){
      state.step = action.payload
    },
    setActionOff(state){
      state.nfts[state.step].action = false
    },
    setActionOn(state){
      state.nfts[state.step].action = true
    },
    setProgWidth(state){
      state.progWidth[state.step] = state.progWidth[state.step] + 1
    },
    setPosition(state){
      state.position = state.position - 78
    },
    moveForward(state, action){
     state.position = state.position - (action.payload * 78)
    },
    moveBack(state, action){
      state.position = state.position - (action.payload * 78)
    },
    fill(state, action){
      state.nfts = state.nfts.map((nft, index) => {
        if(index < action.payload){
          nft.progWidth = 100
          nft.action = false
        }
        else if(index > action.payload){
          nft.progWidth = 0
          nft.action = false
        }
        return nft
      })
    },
    fillAfter(state, action){
      state.nfts = state.nfts.map((nft, index) => {

        return nft
      })
    }
  },
});

export const {
 setProgWidth,
 setActionOn,
 setActionOff,
 setStep,
 setPosition,
 moveForward,
 moveBack,
 fill,
 fillAfter
} = sliderSlice.actions;

export default sliderSlice.reducer;
