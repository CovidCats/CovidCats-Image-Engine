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
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;

const canvas = createCanvas(2048, 2048)
const ctx = canvas.getContext('2d')

// Array representing desired image layers from bottom to top
const layersOrder: {name: string}[] = [
    { name: "Face" },
    { name: "Ear" },
    { name: "Mouth" },
    { name: "Eye" },
    { name: "Whisker" },
    { name: "Mask" }
];

// Input desired traits here
// e.g. createImages(1, 1, 1, 1, 1, 1) => face1.png + ear1.png + mouth1.png + eye1.png + whisker1.png + mask1.png
// createImage(3, 4, 3, 4, 5, 3);

// Unsure how to handle "UnhandledPromiseRejection" when giving input to elementsSetup() that doesn't exist
export async function createImage(face: number, ear: number, mouth: number, eye: number, whisker: number, mask: number) {
    
    const results = elementsSetup(face, ear, mouth, eye, whisker, mask);

    // Load trait images
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
// E.g. Inputting (1, 1, 1, 1, 1, 1) means inputting face1.png, ear1.png, mouth1.png, and so on into the image engine
// Returns array to put into image engine
// TO-DO: Intend to modify function to take strings correlating to trait name in the future
function elementsSetup (face: number, ear: number, mouth: number, eye: number, whisker: number, mask: number) {
    const elementNames = ["face", "ear", "mouth", "eye", "whisker", "mask"]
    const elementArray = [face, ear, mouth, eye, whisker, mask]
    
    const imageArray = layersSetup(layersOrder).map((layer, index) => {
        
        const elementPicked: number | undefined = elementArray[index]
        if (!elementPicked) {throw "Invalid input"}

        if (!layer.elements[elementPicked]) {
            throw `Your selected ${elementNames[index]} doesn't exist`
        }

        return {
            name: layer.name,
            blend: layer.blend,
            opacity: 1,
            selectedElement: layer.elements[elementPicked]
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