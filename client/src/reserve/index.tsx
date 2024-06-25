import { useState } from "react";
// import "./index.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Reserve() {
  function useControlList() {
    const [list, setList] = useState(["A"]);
    const [parent] = useAutoAnimate();

    const handleAdd = () => {
      setList([...list, "B"]);
    };
    const handleRed = () => {
      setList(list.slice(0, list.length - 1));
    };
    return { parent, list, handleAdd, handleRed };
  }

  const { parent, list, handleAdd, handleRed } = useControlList();

  return (
    <>
      <ul ref={parent}>
        {list.map((item, index) => {
          return (
            <li key={index} className="li">
              {item}
            </li>
          );
        })}
      </ul>

      <button onClick={handleAdd}>add</button>
      <button onClick={handleRed}>reduce</button>
    </>
  );
}

export default Reserve;
