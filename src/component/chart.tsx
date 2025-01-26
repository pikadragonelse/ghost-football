import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export type BarChart = { techObject: Record<string, number> };
export const BarChart = ({ techObject }: BarChart) => {
    // Dữ liệu cho biểu đồ
    const data = {
        labels: Object.keys(techObject),
        datasets: [
            {
                label: "Times",
                data: Object.values(techObject),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const, // Vị trí của chú thích
            },
            title: {
                display: true,
                text: "Technique Used", // Tiêu đề biểu đồ
            },
        },
    };

    return (
        <div style={{ width: "600px", margin: "auto" }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
