import { useState, useEffect, useCallback, useRef } from "react";

export default function GameLogic({mode = "classic"}) {
    const [inputValues, setInputValues] = useState({
      firstInput: "",
      secondInput: "",
      thirdInput: "",
      fourthInput: "",
      clicksValue: "?",
      clacksValues: "?",
      disabledFlag: false
    });

    const [inputRows, setInputRows] = useState([{ inputValues }]);
    const [codeAnswer, setCodeAnswer] = useState();
    const [guessCount, setGuessCount] = useState(1);
    const [cracked, setCracked] = useState(false);
    const [giveUpFlag, setGiveUpFlag] = useState(false);

    // scroll to the bottom when inputRows or giveUpFlag is updated 
    const firstRender = useRef(true)
    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    }, [inputRows, giveUpFlag]); 

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

    useEffect(() => {
      generateAnswer()
    }, [])

    // only allow one digit input 
    function checkNumberFieldLength(elem) {
      elem.target.value = elem.target.value.replaceAll("[^0-9]")
      if (elem.target.value.length > 1) {
        elem.target.value = elem.target.value.slice(0, 1);
      }
    }

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

    const refreshPage = useCallback(() => {
      window.location.reload();
    }, []);

    const winner = useCallback(() => {
      setCracked(true);
      alert(`YOU CRACKED IT IN ${guessCount} GUESS${guessCount > 1 ? 'ES' : ''}!`);
    }, [guessCount]);

    const crackButton = useCallback(() => {
      if (cracked || giveUpFlag) {
        refreshPage();
        return "reset";
      } 

      const clicksClacksCount = calculateClicksClacksCount();

      if (clicksClacksCount === 1) {
        return "invalid";
      } 
      
      inputRows[inputRows.length - 1].inputValues.disabledFlag = true;
      setGuessCount(c => c + 1);

      if (clicksClacksCount === 2) {
        winner();
        return "win";
      }

      if (mode === "survival" && guessCount >= 9) {
        setGiveUpFlag(true);
        return "fail";
      }

      setInputRows(prevInputRows => [...prevInputRows, { inputValues }]);
      return "continue";
    }, [cracked, giveUpFlag, calculateClicksClacksCount, winner, inputRows, inputValues, refreshPage]);

    function handleGiveUp() {
      if (giveUpFlag || cracked) {
        return;
      }
      setGiveUpFlag(true);

      // disable last row
      inputRows[inputRows.length-1].inputValues.disabledFlag = true
    }

    return {
        inputRows,
        codeAnswer,
        cracked,
        giveUpFlag,
        guessCount,
        
        refreshPage,
        checkNumberFieldLength,
        handleChange,
        handleNumClick,
        crackButton,
        handleGiveUp,

        setInputRows,
        setInputValues
    };
} 
