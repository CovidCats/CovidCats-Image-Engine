const ethers = require("ethers")

const trait_0: string[] = [
    "face1",
    "face2",
    "face3",
    "face4",
    "face5"
]

const trait_0_weights: number[] = [
    20,
    20,
    20,
    20,
    20
]

const trait_1: string[] = [
    "ear1",
    "ear2",
    "ear3",
    "ear4",
    "ear5",
    "ear6",
    "ear7"
]

const trait_1_weights: number[] = [
    10,
    10,
    10,
    10,
    10,
    10,
    40
]

const trait_2: string[] = [
    "mouth1",
    "mouth2",
    "mouth3",
    "mouth4",
    "mouth5"
]

const trait_2_weights: number[] = [
    20,
    20,
    20,
    20,
    20
]

const trait_3: string[] = [
    "eye1",
    "eye2",
    "eye3",
    "eye4",
    "eye5",
    "eye6"
]

const trait_3_weights: number[] = [
    20,
    20,
    20,
    20,
    10,
    10
]

const trait_4: string[] = [
    "whisker1",
    "whisker2",
    "whisker3",
    "whisker4",
    "whisker5",
    "whisker6",
    "whisker7",
    "whisker8",
    "whisker9"
]

const trait_4_weights:number[] = [
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    20
]

const trait_5: string[] = [
    "mask1",
    "mask2",
    "mask3",
    "mask4",
    "mask5"
]

const trait_5_weights: number[] = [
    20,
    20,
    20,
    20,
    20
]

export function get_random_traits(random_number_array: any[6]): string[] {
    
    const random_number_0 = random_number_array[0]
    const random_number_1 = random_number_array[1]
    const random_number_2 = random_number_array[2]
    const random_number_3 = random_number_array[3]
    const random_number_4 = random_number_array[4]
    const random_number_5 = random_number_array[5]

    let _trait_0: string;
    let _trait_1: string;
    let _trait_2: string;
    let _trait_3: string;
    let _trait_4: string;
    let _trait_5: string;

    let sum = 0;

    for (let i = 0; i < trait_0_weights.length; i++) {
        sum += trait_0_weights[i]!;
        if (sum >= random_number_0) {
            _trait_0 = trait_0[i]!;
            sum = 0;
            break;
        }        
    }

    for (let i = 0; i < trait_1_weights.length; i++) {
        sum += trait_1_weights[i]!;
        if (sum >= random_number_1) {
            _trait_1 = trait_1[i]!;
            sum = 0;
            break;
        }        
    }

    for (let i = 0; i < trait_2_weights.length; i++) {
        sum += trait_2_weights[i]!;
        if (sum >= random_number_2) {
            _trait_2 = trait_2[i]!;
            sum = 0;
            break;
        }        
    }

    for (let i = 0; i < trait_3_weights.length; i++) {
        sum += trait_3_weights[i]!;
        if (sum >= random_number_3) {
            _trait_3 = trait_3[i]!;
            sum = 0;
            break;
        }        
    }

    for (let i = 0; i < trait_4_weights.length; i++) {
        sum += trait_4_weights[i]!;
        if (sum >= random_number_4) {
            _trait_4 = trait_4[i]!;
            sum = 0;
            break;
        }        
    }

    for (let i = 0; i < trait_5_weights.length; i++) {
        sum += trait_5_weights[i]!;
        if (sum >= random_number_5) {
            _trait_5 = trait_5[i]!;
            sum = 0;
            break;
        }        
    }
    
    const traits = [
        _trait_0!,
        _trait_1!,
        _trait_2!,
        _trait_3!,
        _trait_4!,
        _trait_5!,
    ]

    console.log(traits)
    return traits
}

