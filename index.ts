// Before using this script, need to sync Moralis server to the smart contract and Mint event

require("dotenv").config();
const Moralis  = require('moralis/node');
const { createImage } = require('./image_engine')
const { save_metadata_to_ipfs } = require("./save_metadata_to_ipfs")

const serverUrl = process.env.SERVER;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;

const ADDRESS = "0x54C78044296829E50DeA5bb9bD840aBA028F9aA7";

// keccak256 hash of "Mint(address,uint256,string[6])"
const TOPIC = "0x0aa92b279e6b3b794e75bbdb88eba15818573a03c790e2aefb3f7e4e5cefb123";

const main = async () => {
    Moralis.start({ serverUrl, appId, masterKey });

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
        console.log(object._objCount + ' - ' + object.traits);
    }

    // Create event handler for new entry in "mint" table on Moralis server
    let subscription = await query.subscribe();
    console.log("EVENT LISTENER STARTED FOR MINT EVENT")

    subscription.on('create', (object: any) => {    
        object = {...object, ...JSON.parse(JSON.stringify(object))};
        console.log(`MINT! - ${object.traits}`);
        event_to_ipfs(object)

        // Feed traits into image engine
        // Create image and save to IPFS
        // Get image IPFS link
        // const image_ipfs_link = createImage(object.traits[0], object.traits[1], object.traits[2], object.traits[3], object.traits[4], object.traits[5])
        
        // // Generate metadata
        // const metaData = 
        //     {
        //         "name": `Covid Cat #${object._objCount}`,
        //         "attributes": [
        //             {
        //                 "trait_type": "Face",
        //                 "value": object.traits[0]
        //             },
        //             {
        //                 "trait_type": "Ear",
        //                 "value": object.traits[1]
        //             },
        //             {
        //                 "trait_type": "Mouth",
        //                 "value": object.traits[2]
        //             },
        //             {
        //                 "trait_type": "Eye",
        //                 "value": object.traits[3]
        //             },
        //             {
        //                 "trait_type": "Whisker",
        //                 "value": object.traits[4]
        //             },
        //             {
        //                 "trait_type": "Mask",
        //                 "value": object.traits[5]
        //             },
        //         ],
        //         "description": "",
        //         "external_url": "https://covidcats.art/",
        //         "image": image_ipfs_link
        //     }

        // // // Save metadata to IPFS
        // const metadata_ipfs_link = save_metadata_to_ipfs(metaData)
        // console.log(metadata_ipfs_link)

        // Get metadata IPFS link, and update tokenURI

    });    
}

async function event_to_ipfs(object:any) {
        // Feed traits into image engine
        // Create image and save to IPFS
        // Get image IPFS link
        const image_ipfs_link = await createImage(object.traits[0], object.traits[1], object.traits[2], object.traits[3], object.traits[4], object.traits[5])
        
        // Generate metadata
        const metaData = 
            {
                "name": `Covid Cat #${object._objCount}`,
                "attributes": [
                    {
                        "trait_type": "Face",
                        "value": object.traits[0]
                    },
                    {
                        "trait_type": "Ear",
                        "value": object.traits[1]
                    },
                    {
                        "trait_type": "Mouth",
                        "value": object.traits[2]
                    },
                    {
                        "trait_type": "Eye",
                        "value": object.traits[3]
                    },
                    {
                        "trait_type": "Whisker",
                        "value": object.traits[4]
                    },
                    {
                        "trait_type": "Mask",
                        "value": object.traits[5]
                    },
                ],
                "description": "",
                "external_url": "https://covidcats.art/",
                "image": image_ipfs_link
            }

        // // Save metadata to IPFS
        const metadata_ipfs_link = await save_metadata_to_ipfs(metaData)
        console.log(metadata_ipfs_link)
        return metadata_ipfs_link
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  // ABI to paste into Moralis Sync event
  // {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_minter","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenID","type":"uint256"},{"indexed":false,"internalType":"string[6]","name":"traits","type":"string[6]"}],"name":"Mint","type":"event"}