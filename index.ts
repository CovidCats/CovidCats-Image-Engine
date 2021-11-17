// Before using this script, need to sync Moralis server to the smart contract and Mint event

require("dotenv").config();
const Moralis  = require('moralis/node');
const { createImage } = require('./image_engine')
const { get_random_traits } = require('./get_random_traits')
const { save_metadata_to_ipfs } = require("./save_metadata_to_ipfs")

const serverUrl = process.env.SERVER;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;

const ADDRESS = "0x2372c07b7B4EDDb084B269223D5e3c7BBb8933dB";

// keccak256 hash of "Mint(address,uint256,uint256[6])"
const TOPIC = "0x31071d6d30cd620ab825f10ad706534a6bed0e84dc4140d38a88111819ac3162";

const main = async () => {
    Moralis.start({ serverUrl, appId, masterKey });

    // Grab metadata on NFT contract
    const options = { address: ADDRESS, chain: "rinkeby" };
    const metaData = await Moralis.Web3API.token.getNFTMetadata(options);
    console.log("TOKEN meta: ", metaData);

    // Unused?
    const extendedOptions = {address: ADDRESS, chain: "rinkeby", topic: TOPIC};

    // Obtain last 19 or less mint events (will be stored as table rows on Moralis database)
    const Mint = Moralis.Object.extend("mint"); // Insert Moralis table name here
    const query = new Moralis.Query(Mint);
    query.limit(19);
    const results = await query.find();
    console.log("Successfully retrieved " + results.length + " mint events");

    // Run through query results, and console log the traits for each Mint event
    for (let i = 0; i < results.length; i++) {
        let object = results[i];
        object = {...object, ...JSON.parse(JSON.stringify(object))};
        console.log(object._objCount + ' - ' + object.random_numbers);
    }

    // Create event handler for new entry in "mint" table on Moralis server
    let subscription = await query.subscribe();
    console.log("EVENT LISTENER STARTED FOR MINT EVENT")

    subscription.on('create', async (object: any) => {    
        object = {...object, ...JSON.parse(JSON.stringify(object))};
        console.log(`MINT! - ${object.random_numbers}`);
        const traits = get_random_traits(object.random_numbers)
        const tokenURI = await event_to_ipfs(object._objCount, traits)
        console.log(tokenURI)

        // Get metadata IPFS link, and update tokenURI
    });    
}

async function event_to_ipfs(id:number, object:any) {
        // Feed traits into image engine
        // Create image and save to IPFS
        // Get image IPFS link
        const image_ipfs_link = await createImage(object[0], object[1], object[2], object[3], object[4], object[5])
        
        // Generate metadata
        const metaData = 
            {
                "name": `Covid Cat #${id}`,
                "attributes": [
                    {
                        "trait_type": "Face",
                        "value": object[0]
                    },
                    {
                        "trait_type": "Ear",
                        "value": object[1]
                    },
                    {
                        "trait_type": "Mouth",
                        "value": object[2]
                    },
                    {
                        "trait_type": "Eye",
                        "value": object[3]
                    },
                    {
                        "trait_type": "Whisker",
                        "value": object[4]
                    },
                    {
                        "trait_type": "Mask",
                        "value": object[5]
                    },
                ],
                "description": "",
                "external_url": "https://covidcats.art/",
                "image": image_ipfs_link
            }

        // // Save metadata to IPFS
        const metadata_ipfs_link = await save_metadata_to_ipfs(metaData)
        const tokenURI = "ipfs://" + metadata_ipfs_link.slice(-46)
        return tokenURI
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  // ABI to paste into Moralis Sync event
  // {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_minter","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenID","type":"uint256"},{"indexed":false,"internalType":"uint256[6]","name":"random_numbers","type":"uint256[6]"}],"name":"Mint","type":"event"}