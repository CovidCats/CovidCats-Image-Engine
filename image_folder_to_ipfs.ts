// Script to store .png files stored in /layers onto IPFS
// npx ts-node image_to_ipfs

require("dotenv").config();
import * as fs from "fs"
import axios from "axios"

const MoralisIPFSUploadEndpoint = "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder"

const basePath = process.cwd();
const layersDir = `${basePath}/layers`;

interface ImageElement {
    id: number;
    name: string;
    filename: string;
    path: string;
}

interface Layer {
    id: number;
    elements: ImageElement[];
    name: string;
    blend: string;
}

// Array representing desired image layers from bottom to top
const layersOrder: {name: string}[] = [
    { name: "Face" },
    { name: "Ear" },
    { name: "Mouth" },
    { name: "Eye" },
    { name: "Whisker" },
    { name: "Mask" }
];

loadImagesToIPFS()

async function loadImagesToIPFS() {
    const allLayers = layersSetup(layersOrder)
    
    // ipfsArray to send to Moralis endpoint
    let ipfsArray: {path:string, content: string}[] = [];

    // Wrap each fs.readFile in a promise
    // Use Promise.all.then(...) afterwards to ensure all promises (resolved when fs.readFile is completed) fulfilled before going on
    let promises:Promise<null>[] = [];

    // Loop through each layer - Logic to upload folder files to IPFS folder
    for (let layer of allLayers) {
        
        // Loop through each element in the layer
        for (let element of layer.elements) {

            promises.push(new Promise( (res, rej) => {
                
                fs.readFile(element.path, (err, data) => {
                    if(err) rej();

                    ipfsArray.push({
                        path: `${layer.name}/${element.filename}`,
                        content: data.toString("base64")
                    })

                    res(null);
                })
            }))
        }
    }

    Promise.all(promises).then( () => {

        // HTTP Post request to Moralis IPFS Upload Endpoint
        axios.post(MoralisIPFSUploadEndpoint, 
            ipfsArray,
            {
                headers: {
                    "X-API-KEY": process.env.MORALIS_API_KEY!,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            }
        ).then( (res) => {
            // Console logs the IPFS URL
            console.log(res.data);
        })
        .catch ( (error) => {
            console.log(error)
        })

    })
}

// Expand layersOrder array to prepare for image engine
function layersSetup (layersOrder: {name: string}[]) {
    
    const layers: Layer[] = layersOrder.map((layerObj, index) => ({
        id: index,
        elements: getElements(`${layersDir}/${layerObj.name}/`),
        name: layerObj.name,
        blend: 'source-over'
    }))

    return layers
}

// Given path to image folder, return array of objects representing each image file
function getElements (path: string) {
    return fs
        .readdirSync(path)
        .filter((item: string) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i: string, index: number)=> {
            return {
                id: index,
                name: i.slice(0, -4),
                filename: i,
                path: `${path}${i}`
        }
    })
}