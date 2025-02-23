import "./App.css";
import { useState, useRef, useEffect } from "react";
import { FaDice } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaTeamspeak } from "react-icons/fa";
import { HashLoader, MoonLoader } from "react-spinners";
import { Loader } from "./components/Loader.jsx";

const App = () => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const divRef = useRef(null);
  const newElementRef = useRef(null);

  useEffect(() => {
    if (newElementRef.current) {
      newElementRef.current.scrollIntoView({ behavior: "smooth" });
      // divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const surpriseOptions = [
    "Who won the latest Nobel prize in Physics?",
    "Where does pizza come from?",
    "Why is Diwal celebrated?",
    "what is the Difference between a classical and a Quantum Computer",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    setLoading(true);
    try {
      console.log(chatHistory);
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);
      setValue("");
    } catch (error) {
      console.log(error);
      setError("Something Went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setValue("");
    setChatHistory([]);
    setError("");
  };

  return (
    <div className="app text-2xl flex justify-center h-screen  items-center font-[Poppins] ">
      <div className="search-section flex flex-col gap-5 justify-center  max-w-[1120px] items-center p-5 w-full">
        <p className="flex flex-col font-[600] gap-2 items-center w-full justify-between">
          what do you want to know ?
          <button
            onClick={surprise}
            disabled={!chatHistory}
            className="surprise text-lg font-[600] flex items-center gap-2 hover:bg-[#181818] duration-300  cursor-pointer bg-[#303030] p-2.5 rounded-sm "
          >
            Surprise Me!
            <FaDice className="text-3xl" />
          </button>
        </p>
        <div className="input-container w-full flex justify-center items-center ">
          <input
            type="text"
            value={value}
            placeholder="When is Christmas"
            onChange={(e) => setValue(e.target.value)}
            className="flex-4 h-13  no-scrollbar border-l-3 whitespace-normal overflow-auto auto cursor-pointer focus:outline-none bg-[#262626] border-[#e2e2e2] w-full rounded-l-sm  p-5 text-white "
          />
          {!error && (
            <button
              onClick={getResponse}
              className="flex-1 flex max-w-40 justify-center items-center min-w-40 gap-2 hover:bg-[#181818] duration-300  cursor-pointer  bg-[#303030] font-[500] p-2 h-[52px] rounded-r-sm w-full"
            >
              {loading ? (
                <Loader></Loader>
              ) : (
                <>
                  Ask me
                  <FaTeamspeak />
                </>
              )}
              {/* <Loader></Loader> */}
            </button>
          )}
          {error && (
            <button
              className="flex-1 flex items-center max-w-40 justify-center min-w-40 gap-2 hover:bg-[#181818] duration-300  cursor-pointer bg-[#303030] font-[500] p-2.5 rounded-r-sm w-full"
              onClick={clear}
            >
              Clear
            </button>
          )}
        </div>
        {error && <p>{error}</p>}
        <div
          className="search-result  no-scrollbar relative bg-[#202020] font-[Poppins] h-120 bg-slate-1000 rounded-sm  w-full overflow-scroll p-3 text-xl "
          ref={divRef}
        >
          {chatHistory.map((chatItem, index) => (
            <div
              ref={index === chatHistory.length - 2 ? newElementRef : null}
              className={`flex w-full ${
                chatItem.role === "user" ? "justify-end" : ""
              }`}
            >
              <div
                className={` chat-response overflow-hidden  bg-[#303030]  my-2 w-[90%] ${
                  chatItem.role === "user"
                    ? "rounded-l-xl rounded-tr-xl"
                    : "rounded-r-xl rounded-tl-xl"
                }`}
                key={index}
              >
                {chatItem.role == "user" ? (
                  <p className="answer py-1 border-b-1  bg-[#252525] rounded-t-lg font-bold text-xl uppercase text-[#aeaeae]  px-2">
                    {chatItem.role}
                  </p>
                ) : (
                  <p className="answer py-1 border-b-1 bg-[#252525] rounded-t-lg font-bold text-xl uppercase text-[#aeaeae] pl-2">
                    {chatItem.role}
                  </p>
                )}
                {chatItem.role == "user" ? (
                  <p className="answer px-3 py-2 ">{chatItem.parts[0].text}</p>
                ) : (
                  <p className="answer px-3 py-2 ">{chatItem.parts[0].text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
