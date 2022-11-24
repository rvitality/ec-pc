export const calculateAccuracy = (forecasted, actual) => {
    if (!forecasted || !actual) return 0;

    const errorRate = (Math.abs(forecasted - actual) / forecasted) * 100;
    const accuracy = (100 - errorRate).toFixed(2);

    return +accuracy;
};
