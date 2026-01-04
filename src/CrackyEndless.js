import React, { useCallback } from "react"
import {useNavigate} from 'react-router-dom';

export default function CrackyEndless() {
  const navigate = useNavigate();

  // only allow one digit input 
  function checkNumberFieldLength(elem) {
    elem.target.value = elem.target.value.replaceAll("[^0-9]")
    if (elem.target.value.length > 1) {
      elem.target.value = elem.target.value.slice(0,1); 
    }
  }

  const [inputValues, setInputValues] = React.useState(
    {
        firstInput: "",
        secondInput: "",
        thirdInput: "",
        fourthInput: "",
        clicksValue: "?",
        clacksValues: "?",
        disabledFlag: false
    }
  )

  const handleChange = index => event => {
    let newInputValues = [...inputRows]
    if (event.target.name === "firstInput") {
      newInputValues[index].inputValues.firstInput = event.target.value;
    } else if (event.target.name === "secondInput") {
      newInputValues[index].inputValues.secondInput = event.target.value;
    } else if (event.target.name === "thirdInput") {
      newInputValues[index].inputValues.thirdInput = event.target.value;
    } else {
      newInputValues[index].inputValues.fourthInput = event.target.value;
    }
    setInputValues(newInputValues)
  }

  const [inputRows, setInputRows] = React.useState([{inputValues}])

  const [codeAnswer, setCodeAnswer] = React.useState();

  // track number of guesses
  const [guessCount, setGuessCount] = React.useState(1)

  // win condition
  const [cracked, setCracked] = React.useState(false)

  // track give up 
  const [giveUpFlag, setGiveUpFlag] = React.useState(false)

  const calculateClicksClacksCount = useCallback(() => {
    const lastRow = inputRows[inputRows.length - 1];
    if (!lastRow) return 1; // no inputs yet

    const inputList = [
      lastRow.inputValues.firstInput,
      lastRow.inputValues.secondInput,
      lastRow.inputValues.thirdInput,
      lastRow.inputValues.fourthInput
    ];

    if (inputList.includes("") || inputList.includes(undefined)) {
      alert("Please fill in all digits!");
      return 1;
    } 
    if (new Set(inputList).size !== inputList.length) {
      alert("No duplicate digits!");
      return 1;
    }

    // Convert all to Number
    for (let i = 0; i < 4; i++) {
      inputList[i] = Number(inputList[i]);
    }

    let clickCount = 0;
    let clackCount = 0;
    const codeAnswerList = Array.from(String(codeAnswer), Number);

    for (let i = 0; i < 4; i++) {
      if (inputList[i] === codeAnswerList[i]) {
        clickCount++;
      } else if (codeAnswerList.includes(inputList[i])) {
        clackCount++;
      }
    }

    // Update inputValues for last row
    setInputValues(prevInputValues => {
      // Clone prevInputValues to avoid mutation
      const newInputValues = [...inputRows];
      newInputValues[inputRows.length - 1].inputValues.clicksValue = clickCount;
      newInputValues[inputRows.length - 1].inputValues.clacksValues = clackCount;
      return newInputValues;
    });

    if (clickCount === 4) {
      return 2;
    }

    return 0; // default return if no win or error
  }, [inputRows, codeAnswer]);


  const winner = useCallback(() => {
    setInputRows(prevRows => {
      const newRows = [...prevRows];
      if (newRows.length > 0) {
        newRows[newRows.length - 1].inputValues.disabledFlag = true;
      }
      return newRows;
    });
    setCracked(true);
    alert(`YOU CRACKED IT IN ${guessCount} GUESS${guessCount > 1 ? 'ES' : ''}!`);
  }, [guessCount]);


  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);


  const crackButton = useCallback(() => {
    if (cracked || giveUpFlag) {
      refreshPage();
      return;
    } 

    const clicksClacksCount = calculateClicksClacksCount();

    if (clicksClacksCount === 1) {
      return;
    } else if (clicksClacksCount === 2) {
      winner();
      return;
    }

    inputRows[inputRows.length - 1].inputValues.disabledFlag = true;
    setGuessCount(c => c + 1);

    setInputRows(prevInputRows => [...prevInputRows, { inputValues }]);
  }, [cracked, giveUpFlag, calculateClicksClacksCount, winner, inputRows, inputValues, refreshPage]);


  // scroll to the bottom when inputRows or giveUpFlag is updated 
  React.useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  }, [inputRows, giveUpFlag]); 


  const handleNumClick = (num) => {
    const nums = "0123456789";

    // edit the last row
    const index = inputRows.length - 1;

    // current row data
    let newInputValues = [...inputRows];
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
    if (nums.includes(num)) {
      // update next empty spot
      let nextEmptyIndex = digits.findIndex(d => d === "");
      if (nextEmptyIndex !== -1) {
        digits[nextEmptyIndex] = num.toString();
      }
    } else if (num === -1) {
      let lastFilledIndex = [...digits].reverse().findIndex(d => d !== "");
      if (lastFilledIndex !== -1) {
        digits[3 - lastFilledIndex] = "";
      }
    }

    // update state
    current.firstInput = digits[0];
    current.secondInput = digits[1];
    current.thirdInput = digits[2];
    current.fourthInput = digits[3];
    newInputValues[index].inputValues = current;

    setInputValues((prevValues) => [...newInputValues]);
  };


  React.useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      const nums = "0123456789";

      // edit the last row
      const index = inputRows.length - 1;

      // current row data
      let newInputValues = [...inputRows];
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
        crackButton();
      }

      // update state
      current.firstInput = digits[0];
      current.secondInput = digits[1];
      current.thirdInput = digits[2];
      current.fourthInput = digits[3];
      newInputValues[index].inputValues = current;

      setInputValues(newInputValues);
    };

    // add listener
    window.addEventListener("keydown", handleGlobalKeyDown);

    // cleanup on unmount
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [inputRows, setInputValues, crackButton])


  // generate random answer
  function generateAnswer() {
    var temp = [];
    while (temp.length < 4) {
        var n = Math.floor(Math.random() * 10);
        if (!temp.includes(n)) {
            temp.push(n);
        }
    }
    let answer = temp.join("");
    setCodeAnswer(answer);
  }

  React.useEffect(() => {
    generateAnswer()
  }, [])

  function handleGiveUp() {
    if (giveUpFlag) {
      return;
    }
    setGiveUpFlag(true);

    // disable last row
    inputRows[inputRows.length-1].inputValues.disabledFlag = true
  }

  const modal = document.querySelector("#modal");
  const openModal = document.querySelector("#helpButton");
  const closeModal = document.querySelector("#closeModal");

  if (modal) {
    openModal &&
      openModal.addEventListener("click", () => modal.showModal());

    closeModal &&
      closeModal.addEventListener("click", () => modal.close());
  }

  return (
    <div>
      {cracked}
      <div className="nav-bar">
        <button id="crackyHomeButton" onClick={() => navigate("/")}>CRACKY Home</button>
        <button id="playAgainButton" type="button" onClick={refreshPage}>New CRACK</button>
        <button id="giveUpButton" type="button" onClick={handleGiveUp}>Give up CRACK</button>

        <button id="helpButton">Help</button>
        <dialog id="modal" className="dialog">
          <button id="closeModal" className="dialog-close-btn">Close</button>
          <h2>How to CRACK</h2>
          <h4>Crack the code in the least number of guesses!</h4>
          - The number of clicks and clacks will be given to show how close your guess was to the code.<br></br>
          - clicks = correct digit, correct position <br></br>
          - clacks = correct digit, incorrect position <br></br>
          <h4>Examples</h4>
          <p>2834 = 1 clicks, 0 clacks <br></br>
          1 of these digits is correct and in the correct position. </p>
          <p>5107 = 2 clicks, 2 clacks <br></br>
          2 of these digits are correct and in the correct position, and the other 2 digits are correct but in the incorrect position.</p>
          <p>9638 = 0 clicks, 1 clacks <br></br>
          1 of these digits is correct and in the incorrect position.</p>
        </dialog>
      </div>

      {/* title */}
      <div className="title-label">
        <h1>CRACKY</h1>
        <h3>-endless-</h3>
      </div>

      {/* disabled row */}
      <div className="row">
        <div className="input-row">
          <input type="number" className="input-value" disabled/>
          <input type="number" className="input-value" disabled/>
          <input type="number" className="input-value" disabled/>
          <input type="number" className="input-value" disabled/>
        </div>
        <div className="clicks-clacks-row">
          <label className="clicks">clicks</label>
          <label className="clacks">clacks</label>
        </div>
      </div>

      {/* main game */}
      {inputRows.map((row, index) => {
        return (
          <div className="row" key={index}>
            <div className="input-row">
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                name="firstInput"
                value={row.inputValues.firstInput || ''}
                disabled={row.inputValues.disabledFlag}
                readOnly
              />
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                name="secondInput"
                value={row.inputValues.secondInput || ''}
                disabled={row.inputValues.disabledFlag}
                readOnly
              />
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                name="thirdInput"
                value={row.inputValues.thirdInput || ''}
                disabled={row.inputValues.disabledFlag}
                readOnly
              />
              <input 
                type="number" 
                className="input-value" 
                onInput={checkNumberFieldLength} 
                onChange={handleChange(index)} 
                name="fourthInput"
                value={row.inputValues.fourthInput || ''}
                disabled={row.inputValues.disabledFlag}
                readOnly
              />
            </div>
            <div className="clicks-clacks-row">
              <label className="clicks">{row.inputValues.clicksValue}</label>
              <label className="clacks">{row.inputValues.clacksValues}</label>
            </div>
          </div>
        )
      })}

      {/* give up text */}
      {!cracked && giveUpFlag ? <p id="giveUpText">GAME OVER! The code is: {codeAnswer}</p> : ""}
      
      <br></br>

      {/* number pad */}
      <div id="number-pad" className="number-pad">
        <button className="num-btn" onClick={() => handleNumClick(1)}>1</button>
        <button className="num-btn" onClick={() => handleNumClick(2)}>2</button>
        <button className="num-btn" onClick={() => handleNumClick(3)}>3</button>
        <button className="num-btn" onClick={() => handleNumClick(4)}>4</button>
        <button className="num-btn" onClick={() => handleNumClick(5)}>5</button>
        <button className="num-btn" onClick={() => handleNumClick(6)}>6</button>
        <button className="num-btn" onClick={() => handleNumClick(7)}>7</button>
        <button className="num-btn" onClick={() => handleNumClick(8)}>8</button>
        <button className="num-btn" onClick={() => handleNumClick(9)}>9</button>
        <button className="num-btn" onClick={() => handleNumClick(0)}>0</button>
        <button className="num-btn" onClick={() => handleNumClick(-1)}>←</button>
        <button className="num-btn" id="crackButton" type="button" onClick={crackButton}>{cracked || giveUpFlag ? "New CRACK" : "CRACK!"}</button>
      </div>

    </div>
  )
}