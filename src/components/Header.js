import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Appstate } from "../App";

const Header = () => {
  const useAppState = useContext(Appstate);

  return (
    <div className=" header sticky z-10 bg-black top-0  text-3xl text-red-500 font-bold p-3 flex items-center justify-between border-b-2 border-red-500 ">
      <Link to={"/"}>
        <span>
          Filmy<span className="text-white">Verse</span>{" "}
        </span>
      </Link>

      {useAppState.login ? (
        <Link to={"/addmovie"}>
          <h1 className=" text-lg  text-white flex items-center cursor-pointer ">
            <AddIcon className=" mr-1 text-purple-500" />
            Add <span className=" text-red-600">New</span>
          </h1>
        </Link>
      ) : (
        <Link to={"/login"}>
          <h1 className=" text-lg  text-white flex items-center border-white shadow-md hover:-translate-y-1 duration-500 border-2 pl-2  pr-2 rounded-md cursor-pointer ">
            Log <span className=" text-red-600">In</span>
          </h1>
        </Link>
      )}
    </div>
  );
};

export default Header;
