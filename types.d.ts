// declare module "discord.js" {
//     export interface Client {
//       commands: Collection<unknown, any>
//     }
// }



//Type for data from db : an array "games" of objects with properties.
type DataFromDB = {
    // [index: string]: Function|string|number,
    servers: {[key: string]: string}[]
    games: Game[],
}

type Game = {
    category: FreeGameCategory,
    title: string,
    id: string,
    image: string,
    startDate: string,
    endDate: string
}

type GameFromEpic = {
    title: string,
    id: string,
    namespace: string,
    description: string,
    effectiveDate?: string,
    offerType: string,
    expiryDate?: string,
    viewableDate?: string,
    status: string,
    isCodeRedemptionOnly: boolean,
    keyImages: ImageFromEpic,
    seller: {
        id: string,
        name: string
    },
    productSlug: string,
    urlSlug: string,
    url?: string,
    items: any[],
    customAttributes: any[],
    categories: any[],
    tags: any[],
    catalogNs: { mappings: any[] },
    offerMappings: any[],
    price: { totalPrice: any, lineOffers: any[] },
    promotions?: any
}

// An example of GameFromEpic
// {
//     title: 'PAYDAY 2',
//     id: 'de434b7be57940d98ede93b50cdacfc2',
//     namespace: 'd5241c76f178492ea1540fce45616757',
//     description: 'PAYDAY 2 is an action-packed, four-player co-op shooter that once again lets gamers don the masks of the original PAYDAY crew - Dallas, Hoxton, Wolf and Chains - as they descend on Washington DC for an epic crime spree.',
//     effectiveDate: '2099-01-01T00:00:00.000Z',
//     offerType: 'OTHERS',
//     expiryDate: null,
//     viewableDate: '2023-06-01T14:25:00.000Z',
//     status: 'ACTIVE',
//     isCodeRedemptionOnly: true,
//     keyImages: [ [Object], [Object] ],
//     seller: {
//       id: 'o-ufmrk5furrrxgsp5tdngefzt5rxdcn',
//       name: 'Epic Dev Test Account'
//     },
//     productSlug: 'payday-2-c66369',
//     urlSlug: 'mystery-game-7',
//     url: null,
//     items: [ [Object] ],
//     customAttributes: [ [Object], [Object], [Object], [Object], [Object] ],
//     categories: [ [Object], [Object], [Object], [Object] ],
//     tags: [],
//     catalogNs: { mappings: [] },
//     offerMappings: [],
//     price: { totalPrice: [Object], lineOffers: [Array] },
//     promotions: null
// }

type ImageFromEpic = {
    type: string,
    url: string
}
type FreeGameCategory = "currently_free_games" |  "upcoming_free_games"

type FreeGameCommandChoice = FreeGameCategory | "all_free_games"
