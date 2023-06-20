import { Low, JSONFile } from 'lowdb'

// Use JSON file for storage
const file = "./data/db.json";
const adapter = new JSONFile<DataFromDB>(file)
export const db = new Low(adapter)

export const dateToFrenchLanguage = (date: string): string => {

    const formatDate = new Date(date);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return (formatDate.toLocaleDateString('fr-FR', options));
}

export const getIsDatesAreOnSameDay = (firstDate: Date, secondDate: Date) => {
    return (firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate());
}

