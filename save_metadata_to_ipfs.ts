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
  return read_file.ipfs
}

// Example input and call
const metaData = {
  "key" : "value"
}

save_metadata_to_ipfs(metaData)