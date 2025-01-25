import { useState } from "react";
import "./App.css";
import { Player } from "./component/player";
import { getRandomTechniques, randomDefenseScore } from "./util/random";
import { techniques } from "./constant/technique";

function App() {
    const [playerInfoList, setPlayerInfoList] = useState<Player[]>([]);

    const addPlayer = (data: any) => {
        const newPlayer: Player = {
            name: data.name.value,
            number: data.playerNumber.value,
            defenseScore: randomDefenseScore(),
            passingTechs: getRandomTechniques(techniques, 5),
        };
        console.log(newPlayer);

        setPlayerInfoList([...playerInfoList, newPlayer]);
    };

    return (
        <main className="flex flex-col gap-2 items-center">
            <h1>Ghost football</h1>

            <div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        addPlayer(event.target as any);
                    }}
                    className="flex gap-2"
                >
                    <div className="flex items-center p-1 border border-green-400 rounded-md">
                        <input
                            type="text"
                            name="name"
                            placeholder="Player Name"
                        />
                    </div>
                    <div className="flex items-center p-1 border border-green-400 rounded-md">
                        <input
                            type="number"
                            name="playerNumber"
                            placeholder="Player number"
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-400 active:bg-green-700 transition-all"
                    >
                        Add Player
                    </button>
                </form>
            </div>

            <div className="">
                <ul>
                    {playerInfoList.map((player, index) => (
                        <Player key={index} {...player} />
                    ))}
                </ul>
            </div>
        </main>
    );
}

export default App;
