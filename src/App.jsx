import { useContext, useEffect } from "react";
import { totalBlocks } from "./utils/constants";
import { SocketContext } from "./Contexts/SocketContext";

function App() {
  const { coloredBlocks, setColoredBlocks, socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("render", ({ id, ind, state }) => {
      if (id == socket.id) return;
      setColoredBlocks((prev) => ({ ...prev, [ind]: state }));
    });

    socket.on("load", ({ id, blocksData }) => {
      if (id != socket.id) return;
      setColoredBlocks(blocksData);
    });
  }, [socket]);

  const handleBlockClick = (ind) => {
    setColoredBlocks((prev) => {
      socket.emit("update", { id: socket.id, ind: ind, state: !prev[ind] });
      return { ...prev, [ind]: !prev[ind] };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-indigo-700">
          Welcome To Blocky
        </h1>
        <h3 className="text-xl mb-8 text-gray-600">
          Real-Time Block Updates for All Users
        </h3>
        <div className="grid grid-cols-10 gap-2 max-w-md mx-auto">
          {Array.from({ length: totalBlocks }).map((_, ind) => (
            <div
              key={ind}
              className={`aspect-square rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                coloredBlocks[ind]
                  ? "bg-indigo-500 shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleBlockClick(ind)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
