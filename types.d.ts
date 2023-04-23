// declare module "discord.js" {
//     export interface Client {
//       commands: Collection<unknown, any>
//     }
// }



//Type for data from db : an array "games" of objects with properties.
type DataFromDB = {
    // [index: string]: Function|string|number,
    servers: {[key: string]: string}[]
    games: {[key: string]: unknown}[],
}