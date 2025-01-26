export const randomDefenseScore = () => {
    return Math.floor(Math.random() * 5) + 1;
};

export const getRandomList = (list: any, count: number) => {
    const shuffled = [...list].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
};
