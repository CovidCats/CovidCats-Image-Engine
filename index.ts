// Before using this script, need to sync Moralis server to the smart contract and Mint event

require("dotenv").config();
import fs from "fs";
const Moralis  = require('moralis/node');
const { createImage_delta } = require('./scripts/image_engine_delta')
const { createImage_regular } = require('./scripts/image_engine_regular')
const { get_random_traits_regular } = require('./scripts/get_random_traits_regular')
const { get_random_traits_delta } = require('./scripts/get_random_traits_delta')
const { save_metadata_to_ipfs } = require("./scripts/save_metadata_to_ipfs")

const serverUrl = process.env.SERVER;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;

// keccak256 hash of "Mint(address,uint256,uint256[7])"
const TOPIC = "0xc259216ea5a43a79dbc484bc761e3b8148023dec190ade5b1d181d2cb82da449";

const main = async () => {
    // Get address from Hardhat deployment data
    const deploymentData = await fs.readFileSync("./deployments/CovidCats.json");
    const parsed_deploymentData = JSON.parse(deploymentData.toString())
    const _address = parsed_deploymentData.address
    
    // Start Moralis server
    Moralis.start({ serverUrl, appId, masterKey });

    // Grab metadata on NFT contract
    const options = { address: _address, chain: "rinkeby" };
    const metaData = await Moralis.Web3API.token.getNFTMetadata(options);
    console.log("TOKEN meta: ", metaData);

    // Unused?
    const extendedOptions = {address: _address, chain: "rinkeby", topic: TOPIC};

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
        
        // variant_or_delta is the first random number, is a number from 1-100, if 1-20 then is delta, otherwise regular variant
        // random_numbers is the number array determining traits
        // Destructure uint256[7] random_numbers from Mint event on CovidCats.sol, to get these two
        let variant_or_delta: Number, random_numbers: any[6];
        [variant_or_delta, ...random_numbers] = object.random_numbers

        if (variant_or_delta <= 20) {
            // Create image IPFS link for Delta variant
            const traits = get_random_traits_delta(random_numbers)
            const image_ipfs_link = await createImage_delta(traits[0], traits[1], traits[2], traits[3], traits[4], traits[5])
            const metadata_link = await get_metadata_ipfs(object._objCount, traits, image_ipfs_link)
            console.log(metadata_link)
        } else {
            // Create image IPFS link for Regular variant
            const traits = get_random_traits_regular(random_numbers)
            const image_ipfs_link = await createImage_regular(traits[0], traits[1], traits[2], traits[3], traits[4], traits[5])
            const metadata_link = await get_metadata_ipfs(object._objCount, traits, image_ipfs_link)
            console.log(metadata_link)
        }

        // Get metadata IPFS link, and update tokenURI
        // Give this to the user on the frontend, to update the metadata
    });    
}

async function get_metadata_ipfs(id:number, object:any, image_link:string) {

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
                "image": image_link
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
// {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_minter","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenID","type":"uint256"},{"indexed":false,"internalType":"uint256[7]","name":"random_numbers","type":"uint256[7]"}],"name":"Mint","type":"event"}
