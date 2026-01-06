import React, { useState, useCallback } from "react"
import { useNavigate } from 'react-router-dom';
import GameLogic from "./game/GameLogic"
import InputRow from "./components/InputRow";
import NumberPad from "./components/NumberPad";
import Modal from "./components/Modal";

export default function CrackySurvival() {
  const game = GameLogic({mode: "survival"});
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  React.useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      const nums = "0123456789";

      // edit the last row
      const index = game.inputRows.length - 1;

      // current row data
      let newInputValues = [...game.inputRows];
      let current = newInputValues[index].inputValues;

      let digits = [
        current.firstInput || "",
        current.secondInput || "",
        current.thirdInput || "",
        current.fourthInput || ""
      ];

      // ignore if inputs are disabled
      if (current.disabledFlag) return;

      // handle inputs
      if (nums.includes(event.key)) {
        let nextEmptyIndex = digits.findIndex(d => d === "");
        if (nextEmptyIndex !== -1) {
          digits[nextEmptyIndex] = event.key;
        }
      } else if (event.key === "Backspace") {
        let lastFilledIndex = [...digits].reverse().findIndex(d => d !== "");
        if (lastFilledIndex !== -1) {
          digits[3 - lastFilledIndex] = "";
        }
      } else if (event.key === "Enter") {
        game.crackButton();
      }

      // update state
      current.firstInput = digits[0];
      current.secondInput = digits[1];
      current.thirdInput = digits[2];
      current.fourthInput = digits[3];
      newInputValues[index].inputValues = current;

      game.setInputValues(newInputValues);
    };

    // add listener
    window.addEventListener("keydown", handleGlobalKeyDown);

    // cleanup on unmount
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [game.inputRows, game.setInputValues, game.crackButton])


  return (
    <div>
      {game.cracked}
      <div className="nav-bar">
        <button id="crackyHomeButton" onClick={() => navigate("/")}>CRACKY Home</button>
        <button id="playAgainButton" type="button" onClick={game.refreshPage}>New CRACK</button>
        <button id="giveUpButton" type="button" onClick={game.handleGiveUp}>Give up CRACK</button>
        <button id="helpButton" onClick={() => setShowHelp(true)}>Help</button>
      </div>

      <Modal show={showHelp} setShow={setShowHelp} />

      {/* title */}
      <div className="title-label">
        <h1>CRACKY</h1>
        <h3>- Survival -</h3>
      </div>

      {/* disabled row */}
      <InputRow row={{ inputValues: { firstInput: "", secondInput: "", thirdInput: "", fourthInput: "", clicksValue: "clicks", clacksValues: "clacks", disabledFlag: true } }} index={0} handleChange={() => { }} checkNumberFieldLength={() => { }} />

      {/* main game */}
      {game.inputRows.map((row,index) => (
        <InputRow
          key={index}
          row={row}
          index={index}
          handleChange={game.handleChange} 
          checkNumberFieldLength={game.checkNumberFieldLength}
        />
      ))}

      {/* guess counter */}
      <p id="guessCountText">Guesses left: <b>{9 - game.guessCount + 1}</b></p>

      {/* give up text */}
      {!game.cracked && game.giveUpFlag ? <p id="giveUpText">GAME OVER! <br></br>The code is: {game.codeAnswer}</p> : ""}

      <NumberPad
        handleNumClick={game.handleNumClick}
        crackButton={game.crackButton}
        cracked={game.cracked}
        giveUpFlag={game.giveUpFlag}
      />

    </div>
  )
}