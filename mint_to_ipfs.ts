// Before using this script, need to sync Moralis server to the smart contract and Mint event

require("dotenv").config();
const Moralis  = require('moralis/node');
const { createImage } = require('./index')
const { save_metadata_to_ipfs } = require("./save_metadata_to_ipfs")

// const serverUrl = process.env.SERVER;
// const appId = process.env.APP_ID;

const ADDRESS = "0xAa00A05F3E8F113A41f54585Ffe2bbdae8063E25";

// keccak256 hash of "Mint(address,uint256,string[6])"
const TOPIC = "0x0aa92b279e6b3b794e75bbdb88eba15818573a03c790e2aefb3f7e4e5cefb123";

const main = async () => {
    Moralis.start({ serverUrl, appId });

    // Grab metadata on NFT contract
    const options = { address: ADDRESS, chain: "rinkeby" };
    const metaData = await Moralis.Web3API.token.getNFTMetadata(options);
    console.log("TOKEN meta: ", metaData);

    // Unused?
    const extendedOptions = {address: ADDRESS, chain: "rinkeby", topic: TOPIC};

    // Obtain last 19 or less mint events (will be stored as table rows on Moralis database)
    const Mint = Moralis.Object.extend("mint");
    const query = new Moralis.Query(Mint);
    query.limit(19);
    const results = await query.find();
    console.log("Successfully retrieved " + results.length + " mint events");

    // Run through query results, and console log the traits for each Mint event
    for (let i = 0; i < results.length; i++) {
        let object = results[i];
        object = {...object, ...JSON.parse(JSON.stringify(object))};
        console.log(object.id + ' traits - ' + object.traits);
        console.log(object)
    }

    

    // Create event handler for new entry in "mint" table on Moralis server
    let subscription = await query.subscribe();
    console.log("EVENT LISTENER STARTED FOR MINT EVENT")

    subscription.on('create', (object: any) => {    
        object = {...object, ...JSON.parse(JSON.stringify(object))};
        console.log(object.id + ' traits - ' + object.traits);
        console.log('object created');

        // Mapping of traits to number, otherwise will have to modify index.ts so that createImage() takes strings as arguments rather than number

        // Feed traits into image engine
        // createImage(object.traits[0], object.traits[1], object.traits[2], object.traits[3], object.traits[4], object.traits[5])

        // Get image IPFS link
        const image_ipfs_link = createImage(1,1,1,1,1,1)
        
        // Generate metadata
        const metaData = {
                            "name": `Covid Cat #${object.tokenId}`,
                            "attributes": [
                                {
                                    "trait_type": "Ear",
                                    "value": "gold"
                                },
                                {
                                    "trait_type": "Eye",
                                    "value": "oni's head protector"
                                },
                                {
                                    "trait_type": "Face",
                                    "value": "santa puffer jacket"
                                },
                                {
                                    "trait_type": "Mask",
                                    "value": "azure"
                                },
                                {
                                    "trait_type": "Mouth",
                                    "value": "Cosmic"
                                },
                                {
                                    "trait_type": "Whisker",
                                    "value": "red protective arm"
                                },
                            ],
                            "description": "",
                            "external_url": "https://covidcats.art/",
                            "image": image_ipfs_link
                        }

        // Save metadata to IPFS
        const metadata_ipfs_link = save_metadata_to_ipfs(metaData)

        // Get metadata IPFS link, and update tokenURI

    });    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });