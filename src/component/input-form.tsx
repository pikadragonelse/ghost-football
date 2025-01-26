export type InputForm = { onAdd?: (data: any) => void; canAdd?: boolean };
export const InputForm = ({ onAdd = () => {}, canAdd }: InputForm) => {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onAdd(event.target as any);
            }}
            className="flex gap-2"
        >
            <div className="flex items-center p-1 border border-green-400 rounded-md">
                <input type="text" name="name" placeholder="Player Name" />
            </div>
            <div className="flex items-center p-1 border border-green-400 rounded-md">
                <input
                    type="number"
                    name="playerNumber"
                    placeholder="Player number"
                />
            </div>
            {canAdd && (
                <button
                    type="submit"
                    className="text-white bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-400 active:bg-green-700 transition-all"
                >
                    Add Player
                </button>
            )}
        </form>
    );
};
