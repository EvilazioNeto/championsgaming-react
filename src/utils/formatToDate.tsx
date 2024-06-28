export const formatToDate = (date: Date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};