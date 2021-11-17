# CovidCats-Image-Engine


<img src="https://raw.githubusercontent.com/kyzooghost/CovidCats-Image-Engine/main/images/homecat.png" width="512" height="512" />

To upload all /layer .png files to a single IPFS folder: `npx ts-node image_to_ipfs`

Layer Order:
- Face
- Ears
- Mouth
- Eyes
- Whiskers
- Mask


To start an event listener for Mint event on CovidCats.sol contract, that will console log a tokenURI string for each Mint even it picks up, run `npx ts-node index`