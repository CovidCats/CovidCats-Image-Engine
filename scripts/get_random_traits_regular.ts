const ethers = require("ethers")

const trait_0: string[] = [
    "face1"
]

const trait_0_weights: number[] = [
    100
]

const trait_1: string[] = [
    "ear1",
    "ear2",
    "ear3",
    "ear4",
    "ear5",
    "ear6",
    "ear7",
    "ear8",
    "ear9",
    "ear10",
    "ear11",
    "ear12",
    "ear13",
    "ear14",
    "ear15",
    "ear16",
    "ear17",
    "ear18",
    "ear19",
    "ear20",
    "ear21",
    "ear22",
    "ear23",
    "ear24",
    "ear25",
    "ear26",
    "ear27",
    "ear28",
    "ear29",
    "ear30",
    "ear31",
    "ear32",
    "ear33",
    "ear34"
]

const trait_1_weights: number[] = [
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    2.5,
    2.5,
    2.5,
    2.5
]

const trait_2: string[] = [
    "mouth1",
    "mouth2",
    "mouth3",
    "mouth4",
    "mouth5",
    "mouth6",
    "mouth7",
    "mouth8",
    "mouth9",
    "mouth10",
    "mouth11",
    "mouth12",
    "mouth13",
    "mouth14",
    "mouth15",
    "mouth16",
    "mouth17",
    "mouth18",
    "mouth19",
    "mouth20",
    "mouth21",
    "mouth22",
    "mouth23",
    "mouth24",
    "mouth25",
    "mouth26",
    "mouth27",
    "mouth28",
    "mouth29"
]

const trait_2_weights: number[] = [
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    4
]

const trait_3: string[] = [
    "eyes1",
    "eyes2",
    "eyes3",
    "eyes4",
    "eyes5",
    "eyes6",
    "eyes7",
    "eyes8",
    "eyes9",
    "eyes10",
    "eyes11",
    "eyes12",
    "eyes13",
    "eyes14",
    "eyes15",
    "eyes16",
    "eyes17",
    "eyes18",
    "eyes19",
    "eyes20",
    "eyes21",
    "eyes22",
    "eyes23",
    "eyes24",
    "eyes25",
    "eyes26",
    "eyes27",
    "eyes28",
    "eyes29",
    "eyes30",
    "eyes31",
    "eyes32"
]

const trait_3_weights: number[] = [
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    5,
    5
]

const trait_4: string[] = [
    "accessory1",
    "accessory2",
    "accessory3",
    "accessory4",
    "accessory5",
    "accessory6",
    "accessory7",
    "accessory8",
    "accessory9",
    "accessory10",
    "accessory11",
    "accessory12",
    "accessory13",
    "accessory14",
    "accessory15",
    "accessory16",
    "accessory17",
    "accessory18",
    "accessory19",
    "accessory20",
    "accessory21",
    "accessory22",
]

const trait_4_weights:number[] = [
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    10,
    10
]

const trait_5: string[] = [
    "mask1",
    "mask2",
    "mask3",
    "mask4",
    "mask5",
    "mask6"
]

const trait_5_weights: number[] = [
    20,
    20,
    20,
    20,
    10,
    10
]

export function get_random_traits_regular(random_number_array: any[6]): string[] {
    
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

