export const getPageArrayInitialState = (data = []) => {
    if (!data) return;
    return Array(data.length > 5 ? 5 : data.length)
        .fill(0)
        .map((_, index) => index + 1);
};
