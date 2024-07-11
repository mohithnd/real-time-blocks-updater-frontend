import { useContext, useEffect, useState } from "react";
import { totalBlocks } from "./utils/constants";
import { SocketContext } from "./Contexts/SocketContext";

function App() {
  const { coloredBlocks, setColoredBlocks, socket } = useContext(SocketContext);
  const [users, setUsers] = useState(1);

  useEffect(() => {
    socket.on("render", ({ id, ind, state }) => {
      if (id == socket.id) return;
      setColoredBlocks((prev) => ({ ...prev, [ind]: state }));
    });

    socket.on("load", ({ id, blocksData }) => {
      if (id != socket.id) return;
      setColoredBlocks(blocksData);
    });

    socket.on("users", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const handleBlockClick = (ind) => {
    setColoredBlocks((prev) => {
      socket.emit("update", { id: socket.id, ind: ind, state: !prev[ind] });
      return { ...prev, [ind]: !prev[ind] };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 sm:p-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-2">
            Welcome To Blocky
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Real-Time Block Updates for All Users
          </p>
        </header>
        <div className="flex justify-center mb-6">
          <span className="bg-indigo-100 text-indigo-800 py-2 px-4 rounded-full font-semibold">
            Users Online: {users}
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 max-w-2xl mx-auto">
          {Array.from({ length: totalBlocks }).map((_, ind) => (
            <div
              key={ind}
              className={`aspect-square w-10 sm:w-12 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
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
