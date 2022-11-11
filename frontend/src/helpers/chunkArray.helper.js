export const chunkArray = (arr, chunk = 10) => {
    const arrCopy = [...arr];
    const res = [];

    while (arrCopy.length > 0) {
        res.push(arrCopy.splice(0, chunk));
    }

    return res;
};
