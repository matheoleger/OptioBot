export const dateToFrenchLanguage = (date: string): string => {

    const formatDate = new Date(date);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return (formatDate.toLocaleDateString('fr-FR', options));
}
