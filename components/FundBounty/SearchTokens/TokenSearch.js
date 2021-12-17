// Third Party
import React from "react";
import TokenList from "./TokenList";

const TokenSearch = ({ setShowTokenSearch, onCurrencySelect }) => {
  return (
    <div>
      <div className="justify-center font-mont items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg  flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-solid rounded-t">
              <h3 className="text-1xl text-black font-semibold">
                Select a Token
              </h3>
            </div>
            <div className=" p-6 flex-auto">
              <TokenList
                onCurrencySelect={onCurrencySelect}
                setShowTokenSearch={setShowTokenSearch}
              />
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowTokenSearch(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 bg-black"></div>
    </div>
  );
};

export default TokenSearch;
