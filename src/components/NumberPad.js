import React from "react";

export default function NumberPad({ handleNumClick, crackButton, cracked, giveUpFlag, handleCrack }) {
  return (
    <div id="number-pad" className="number-pad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
        <button key={n} className="num-btn" onClick={() => handleNumClick(n)}>{n}</button>
      ))}
      <button className="num-btn" onClick={() => handleNumClick(-1)}>←</button>
      <button className="num-btn" id="crackButton" onClick={handleCrack}>
        {cracked || giveUpFlag ? "New CRACK" : "CRACK!"}
      </button>
    </div>
  );
}