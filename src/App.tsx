import { useEffect, useState } from "react";
import "./App.css";
import { Player } from "./component/player";
import { getRandomList, randomDefenseScore } from "./util/random";
import { techniques } from "./constant/technique";
import clsx from "clsx";
import { InputForm } from "./component/input-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSoccerBall } from "@fortawesome/free-solid-svg-icons";
import { checkPassing } from "./util/check-passing";
import { PassingTech } from "./model/passing-tech";
import BarChart from "./component/chart";

const techniqueObject: Record<string, number> = {
    "Neymar Rainbow Flick": 0,
    "El Tornado": 0,
    "Waka Waka": 0,
    "Sombrero Flick": 0,
    "Okocha Sombrero Flick": 0,
    "Bolasie Flick": 0,
    "Fake Pass": 0,
    "Ball Roll Chop": 0,
    "Ball Roll Cut": 0,
    "Ball Hop": 0,
    "Simple Rainbow": 0,
};

function App() {
    const [playerInfoList, setPlayerInfoList] = useState<Player[]>([]);
    const [defenseList, setDefenseList] = useState<Player[]>([]);
    const [defensePlayer, setDefensePlayer] = useState<Player>();
    const [listLog, setListLog] = useState<string[]>([]);
    const [reHolding, setReHolding] = useState<number>(0);
    const [reGetDefensePlayer, setReGetDefensePlayer] = useState(0);
    const [reStartRound, setReStartRound] = useState(0);
    const [timeRounds, setTimeRounds] = useState(10);

    const getDefensePlayer = () => {
        const defensePlayers: Player[] = getRandomList(defenseList, 1);

        setDefensePlayer(defensePlayers[0]);
        setDefenseList((prev) => {
            return [...prev].filter(
                (player) => player.id !== defensePlayers[0].id
            );
        });
        setPlayerInfoList((prev) => {
            return [...prev].map((player) => {
                if (player.id === defensePlayers[0].id) {
                    return {
                        ...player,
                        isDefensedInRound: player.id === defensePlayers[0].id,
                        defenseIndex: 1,
                        isOutRound: player.id === defensePlayers[0].id,
                    };
                }
                return player;
            });
        });
    };

    const switchDefensePlayers = (passFailPlayer: Player) => {
        setDefensePlayer(passFailPlayer);
        const countDefensePlayer = playerInfoList.filter(
            (player) => player.isDefensedInRound === true
        ).length;
        setPlayerInfoList((prev) => {
            return [...prev].map((player) => {
                if (player.id === passFailPlayer.id) {
                    return {
                        ...player,
                        isDefensedInRound: player.id === passFailPlayer.id,
                        defenseIndex: countDefensePlayer + 1,
                        isOutRound: player.id === passFailPlayer.id,
                    };
                }
                return player;
            });
        });
    };

    const randomizeHolding = (isStart: boolean) => {
        const holdingPLayer = playerInfoList.find(
            (player) => player.isHolding === true
        );

        let randomIndex = 0;

        if (isStart) {
            randomIndex = Math.floor(Math.random() * playerInfoList.length);
        } else {
            do {
                randomIndex = Math.floor(Math.random() * playerInfoList.length);
            } while (
                playerInfoList[randomIndex].isHolding === true ||
                playerInfoList[randomIndex].id === defensePlayer?.id ||
                playerInfoList[randomIndex].isOutRound === true
            );
        }

        const updatedItems = playerInfoList.map((item, index) => ({
            ...item,
            isHolding: index === randomIndex,
        }));

        setPlayerInfoList(updatedItems);
        if (holdingPLayer != null) {
            setListLog((prev) => [
                ...prev,
                `Pass to:  ${playerInfoList[randomIndex].name}-${playerInfoList[randomIndex].number}`,
            ]);
        } else {
            setListLog((prev) => [
                ...prev,
                `Choose first position:  ${playerInfoList[randomIndex].name}-${playerInfoList[randomIndex].number}`,
            ]);
        }
    };

    const handlePass = () => {
        const holdingPLayer = playerInfoList.find(
            (player) => player.isHolding === true
        );

        const passingTechniqueUsed: PassingTech = getRandomList(
            holdingPLayer?.passingTechs || [],
            1
        )[0];

        techniqueObject[passingTechniqueUsed.name] += 1;

        const isPass = checkPassing(
            passingTechniqueUsed.techniqueScore,
            defensePlayer?.defenseScore || 1
        );

        if (isPass) {
            setListLog((prev) => [
                ...prev,
                `Pass successfully by ${passingTechniqueUsed.name}!`,
            ]);
            setPlayerInfoList((prev) => {
                return [...prev].map((player) => {
                    if (player.isDefensedInRound === false) {
                        return {
                            ...player,
                            passingTechSuccessfulScore:
                                player.passingTechSuccessfulScore ||
                                0 + passingTechniqueUsed.techniqueScore,
                        };
                    }
                    return player;
                });
            });
        } else {
            setListLog((prev) => [...prev, `Pass fail!`]);
            switchDefensePlayers(holdingPLayer as any);
            setPlayerInfoList((prev) => {
                return [...prev].map((player) => {
                    if (player.id === holdingPLayer?.id) {
                        return {
                            ...player,
                            isOutRound: true,
                        };
                    }
                    return player;
                });
            });
        }
        if (defenseList.length > -1) {
            setReHolding((prev) => prev + 1);
        } else {
            alert("End game! Please check results and chart below.");
        }
    };

    const handleStart = async () => {
        randomizeHolding(true);
    };

    const clear = () => {
        setPlayerInfoList([]);
        setDefenseList([]);
        setDefensePlayer(undefined);
        setListLog([]);
    };

    const resetRound = () => {
        setPlayerInfoList((prev) => {
            return [...prev].map((player) => {
                return {
                    ...player,
                    isDefensedInRound: false,
                    isHolding: false,
                    isDefensed: false,
                    isOutRound: false,
                    defenseIndex: undefined,
                };
            });
        });
        setReGetDefensePlayer((prev) => prev + 1);
    };

    const addPlayer = (data: any) => {
        if (data.name.value.trim() === "" || data.playerNumber.value === "") {
            alert("Please fill in the required fields.");
            return;
        }
        const newPlayer: Player = {
            id: playerInfoList.length,
            name: data.name.value,
            number: data.playerNumber.value,
            defenseScore: randomDefenseScore(),
            passingTechs: getRandomList(techniques, 5),
            isHolding: false,
            isDefensedInRound: false,
            isOutRound: false,
        };

        setPlayerInfoList((prev) => [...prev, { ...newPlayer }]);
        setDefenseList((prev) => [...prev, { ...newPlayer }]);
    };

    useEffect(() => {
        if (playerInfoList.length > 0) {
            randomizeHolding(false);

            const defensePlayersCount = playerInfoList.filter(
                (player) => player.isDefensedInRound === false
            ).length;

            if (defensePlayersCount === 1 && defenseList.length > 0) {
                setPlayerInfoList((prev) => {
                    return [...prev].map((player) => {
                        return {
                            ...player,
                            ratingScore:
                                (player.ratingScore || 0) +
                                (10 -
                                    (player.defenseIndex || 0) +
                                    (player.passingTechSuccessfulScore || 0)),
                        };
                    });
                });
                resetRound();
                alert(`End round ${Math.abs(defenseList.length - 9) + 1}`);
            }
        }
    }, [reHolding]);

    useEffect(() => {
        if (timeRounds > 0) {
            if (reGetDefensePlayer > 0) {
                getDefensePlayer();
                setReStartRound((prev) => prev + 1);
                setTimeRounds((prev) => prev - 1);
            }
        } else {
            alert("End game! Please check results and chart below.");
        }
    }, [reGetDefensePlayer]);

    useEffect(() => {
        if (reStartRound > 0) {
            handleStart();
        }
    }, [reStartRound]);

    return (
        <div className="">
            <main className="flex flex-col gap-2 items-center">
                <h1>Ghost football</h1>

                <div className="flex gap-2">
                    <InputForm
                        canAdd={playerInfoList.length < 10}
                        onAdd={addPlayer}
                    />
                    {playerInfoList.length > 0 && (
                        <button
                            className="text-white bg-red-500 p-2 rounded-md cursor-pointer hover:bg-red-400 active:bg-red-700 transition-all"
                            onClick={clear}
                        >
                            Clear
                        </button>
                    )}
                </div>

                <ul className="flex gap-2 flex-wrap mt-4">
                    {playerInfoList.map((player, index) => (
                        <li
                            className={clsx(
                                `text-xs pr-2  border-r border-green-700`,
                                {
                                    "w-[18%]": playerInfoList.length > 5,
                                }
                            )}
                        >
                            <Player
                                key={index}
                                {...player}
                                isDefense={player.id === defensePlayer?.id}
                            />
                        </li>
                    ))}
                </ul>
                {playerInfoList.length === 10 && (
                    <button
                        className="text-white bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-400 active:bg-green-700 transition-all"
                        onClick={getDefensePlayer}
                    >
                        Get defense player
                    </button>
                )}

                {defensePlayer != null ? (
                    <div className="">
                        <button
                            className="text-white bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-400 active:bg-green-700 transition-all"
                            onClick={handleStart}
                        >
                            Start
                        </button>
                    </div>
                ) : (
                    ""
                )}
                <div className="flex gap-4 justify-around w-full">
                    <div className="mt-20 -ml-30 max-w-56">
                        <h1 className="font-medium">Game information: </h1>
                        <ul className="max-h-60 overflow-auto">
                            {listLog.map((log) => (
                                <li>
                                    <p>- {log}</p>
                                </li>
                            ))}
                        </ul>
                        <p></p>
                    </div>
                    <div className="flex flex-col items-center relative">
                        <div className="">
                            Round {Math.abs(defenseList.length - 9) + 1}
                        </div>
                        <button
                            className="text-white bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-400 active:bg-green-700 transition-all"
                            onClick={handlePass}
                        >
                            Pass
                        </button>
                        <div className="relative w-64 h-64 flex items-center justify-center mt-50">
                            <div className="absolute flex-col text-center text-xs top-1/2 left-1/2 transform translate-x-12 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                                Defense player
                                <p>{defensePlayer?.name}</p>
                                <p>{defensePlayer?.number}</p>
                            </div>
                            <ul>
                                {playerInfoList.map((player, index) => {
                                    if (!(defensePlayer != null)) return;
                                    if (player.id === defensePlayer.id) return;
                                    if (player.isOutRound === true) return;

                                    const angle =
                                        (360 / defenseList.length - 4) * index;

                                    return (
                                        <li
                                            className="text-sm absolute max-w-3min-w-30 w-3 min-w-30 transform flex  items-center justify-center"
                                            style={{
                                                transform: `rotate(${angle}deg) translate(15rem) rotate(-${angle}deg)`,
                                            }}
                                        >
                                            {player.isHolding && (
                                                <div className="">
                                                    <FontAwesomeIcon
                                                        icon={faSoccerBall}
                                                    />
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <p>{player.name}</p>
                                                <p className="font-medium">
                                                    {player.number}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="w-fit ml-10 mr-auto">
                    <h1 className="text-2xl font-medium">Result list</h1>
                    <ul className="list-decimal">
                        {[...playerInfoList]
                            .sort(
                                (a, b) =>
                                    (b.ratingScore || 0) - (a.ratingScore || 0)
                            )
                            .map((player, index) => (
                                <li
                                    className={clsx({
                                        "text-white bg-green-600": index < 3,
                                    })}
                                >
                                    {player.name}-{player.number}:{" "}
                                    {player.ratingScore || 0}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="">
                    <BarChart techObject={techniqueObject} />
                </div>
            </main>
        </div>
    );
}

export default App;
