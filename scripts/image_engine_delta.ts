// Script to input desired traits, and generate final NFT image

import * as fs from "fs"
const { createCanvas, loadImage } = require('canvas')
import { save_image_to_ipfs } from "./save_image_to_ipfs"

interface RenderObject {
    layer: {
        name: string;
        blend: string;
        opacity: number;
        selectedElement: ImageElement
    }
    loadedImage: object;
}

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

const basePath = process.cwd();
const layersDir = `${basePath}/layers_delta`;

const canvas = createCanvas(2048, 2048)
const ctx = canvas.getContext('2d')

// Array representing desired image layers from bottom to top
const layersOrder: {name: string}[] = [
    { name: "Face" },
    { name: "Ear" },
    { name: "Mouth" },
    { name: "Eyes" },
    { name: "Accessory" },
    { name: "Mask" }
];

// Input desired traits here
// e.g. createImages("face1", "ear1", "mouth1", "eye1", "whisker1", "mask1") => face1.png + ear1.png + mouth1.png + eye1.png + whisker1.png + mask1.png
// Unsure how to handle "UnhandledPromiseRejection" when giving input to elementsSetup() that doesn't exist
export async function createImage_delta(layer_0: string, layer_1: string, layer_2: string, layer_3: string, layer_4: string, layer_5: string) {

    // Load the object representing the image layers to be rendered
    const results = elementsSetup(layer_0, layer_1, layer_2, layer_3, layer_4, layer_5)

    // Load trait image files
    let loadedElements: Promise<any>[] = [];

    results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });

    await Promise.all(loadedElements)
        // .then((renderObjectArray: {layer:{name: string, blend: string, opacity: number, selectedElement: {id: number, name: string, filename: string, path: string}}, loadedImage:object}[]) => {
        .then((renderObjectArray: RenderObject[]) => {
            
            // Delete previous canvas, and create new canvas with white background
            ctx.clearRect(0, 0, 2048, 2048);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, 2048, 2048);
            
            // Create image file by layering trait images on top in the specified order
            renderObjectArray.forEach((renderObject, index) => {drawElement(renderObject, index)});

            // Save image file to 0.png in root directory
            // fs.writeFileSync(`${basePath}/0.png`, canvas.toBuffer("image/png"))
        })
    
    const ipfs_link = await save_image_to_ipfs(canvas)
    return ipfs_link;
}

function drawElement (_renderObject: RenderObject, _index: number) {
    ctx.globalAlpha = _renderObject.layer.opacity;
    ctx.globalCompositeOperation = _renderObject.layer.blend;
    ctx.drawImage(_renderObject.loadedImage, 0, 0, 2048, 2048);
}

async function loadLayerImg (_layer: { selectedElement: { path: string; } | undefined; } | undefined) {
    return new Promise(async (resolve) => {
        const image = await loadImage(`${_layer?.selectedElement?.path}`);
        resolve({ layer: _layer, loadedImage: image });
    })
}

// Input which specific elements you want to compose the image
// E.g. Inputting ("face1", "ear1", "mouth1", "eye1", "whisker1", "mask1") means inputting face1.png, ear1.png, mouth1.png, and so on into the image engine
// Returns array to put into image engine
function elementsSetup (layer_0: string, layer_1: string, layer_2: string, layer_3: string, layer_4: string, layer_5: string) {
    
    // Input validation - all inputs must be existing files or else the code throws an error
    const layer_0_file_names:string[] = [];
    const layer_1_file_names:string[] = [];
    const layer_2_file_names:string[] = [];
    const layer_3_file_names:string[] = [];
    const layer_4_file_names:string[] = [];
    const layer_5_file_names:string[] = [];

    const allLayers = layersSetup(layersOrder);

    for (let layer in allLayers) {
        switch (layer) {
            case '0':
                for (let element of allLayers[layer]?.elements!) {
                    layer_0_file_names.push(element.name)
                }    
                break;
            case '1':
                for (let element of allLayers[layer]?.elements!) {
                    layer_1_file_names.push(element.name)
                }    
                break;
            case '2':
                for (let element of allLayers[layer]?.elements!) {
                    layer_2_file_names.push(element.name)
                }    
                break;
            case '3':
                for (let element of allLayers[layer]?.elements!) {
                    layer_3_file_names.push(element.name)
                }    
                break;
            case '4':
                for (let element of allLayers[layer]?.elements!) {
                    layer_4_file_names.push(element.name)
                }    
                break;
            case '5':
                for (let element of allLayers[layer]?.elements!) {
                    layer_5_file_names.push(element.name)
                }    
                break;
        }
    }

    if (!layer_0_file_names.includes(layer_0)) {throw "Provided layer 0 trait doesn't exist"}
    if (!layer_1_file_names.includes(layer_1)) {throw "Provided layer 1 trait doesn't exist"}
    if (!layer_2_file_names.includes(layer_2)) {throw "Provided layer 2 trait doesn't exist"}
    if (!layer_3_file_names.includes(layer_3)) {throw "Provided layer 3 trait doesn't exist"}
    if (!layer_4_file_names.includes(layer_4)) {throw "Provided layer 4 trait doesn't exist"}
    if (!layer_5_file_names.includes(layer_5)) {throw "Provided layer 5 trait doesn't exist"}

    // Map each layer into the selected trait image object to be rendered
    const imageArray = layersSetup(layersOrder).map((layer, index) => {
        
        // Loop through each element in the layer, and pick the one that is selected
        let selectedIndex: number;

        for (let element of layer.elements) {
            if (element.name == arguments[index]) {
                selectedIndex = element.id
            }
        }

        return {
            name: layer.name,
            blend: layer.blend,
            opacity: 1,
            selectedElement: layer.elements[selectedIndex!]
        }
    })

    return imageArray;
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

// Input which specific elements you want to compose the image
// E.g. Inputting (1, 1, 1, 1, 1, 1) means inputting face1.png, ear1.png, mouth1.png, and so on into the image engine
// Returns array to put into image engine
// TO-DO: Intend to modify function to take strings correlating to trait name in the future
// function elementsSetup (face: number, ear: number, mouth: number, eye: number, whisker: number, mask: number) {
//     const elementNames = ["face", "ear", "mouth", "eye", "whisker", "mask"]
//     const elementArray = [face, ear, mouth, eye, whisker, mask]
    
//     const imageArray = layersSetup(layersOrder).map((layer, index) => {
        
//         const elementPicked: number | undefined = elementArray[index]
//         if (!elementPicked) {throw "Invalid input"}

//         if (!layer.elements[elementPicked]) {
//             throw `Your selected ${elementNames[index]} doesn't exist`
//         }

//         return {
//             name: layer.name,
//             blend: layer.blend,
//             opacity: 1,
//             selectedElement: layer.elements[elementPicked]
//         }
//     })

//     return imageArray;
// }

// Set up build directory to place images in
// If have pre-existing build directory, delete it
// function buildSetup () {
//     if (fs.existsSync(buildDir)) {
//       fs.rmdirSync(buildDir, { recursive: true });
//     }
//     fs.mkdirSync(buildDir);
//     fs.mkdirSync(`${buildDir}/json`);
//     fs.mkdirSync(`${buildDir}/images`);
// };

// // Save current canvas to .png file in build directory
// // _editionCount = name of .png file
// function saveImage (_editionCount: number) {
//     fs.writeFileSync(`${buildDir}/images/${_editionCount}.png`, canvas.toBuffer("image/png"));
// };