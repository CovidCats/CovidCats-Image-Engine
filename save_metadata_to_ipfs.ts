require("dotenv").config();
import Moralis from 'moralis/node'

const serverUrl = process.env.SERVER;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;
Moralis.start({ serverUrl, appId, masterKey });

export async function save_metadata_to_ipfs(_metadata: object) {
  const data = JSON.stringify(_metadata)
  const altered_data = Buffer.from(data).toString('base64');
  const file = new Moralis.File("file.json", {base64 : altered_data});
  await file.saveIPFS({ useMasterKey: true });
  const read_file = JSON.parse(JSON.stringify(file))
  const IPFS_link = read_file.ipfs;
  console.log(IPFS_link)
  return IPFS_link
}

// Example input and call
// const metaData =
// {
//   "name": `Covid Cat #1`,
//   "attributes": [
//       {
//           "trait_type": "Face",
//           "value": "face2"
//       },
//       {
//           "trait_type": "Ear",
//           "value": "ear7"
//       },
//       {
//           "trait_type": "Mouth",
//           "value": "mouth4"
//       },
//       {
//           "trait_type": "Eye",
//           "value": "eye1"
//       },
//       {
//           "trait_type": "Whisker",
//           "value": "whisker3"
//       },
//       {
//           "trait_type": "Mask",
//           "value": "mask1"
//       },
//   ],
//   "description": "",
//   "external_url": "https://covidcats.art/",
//   "image": "https://ipfs.moralis.io:2053/ipfs/QmY5xn6tJTDKNqngRfUjm3jVeDp1VRHYrwYXCTnL5LP1Jx"
// }

// save_metadata_to_ipfs(metaData)