import { PassingTech } from "../component/model/passing-tech";

export const randomDefenseScore = () => {
    return Math.floor(Math.random() * 5) + 1;
};

export const getRandomTechniques = (
    techniques: PassingTech[],
    count: number
) => {
    const shuffled = [...techniques].sort(() => Math.random() - 0.5); // Trộn ngẫu nhiên
    return shuffled.slice(0, count); // Lấy `count` phần tử đầu tiên
};
