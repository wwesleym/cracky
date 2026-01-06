import React from "react";

export default function InputRow({ row, index, handleChange, checkNumberFieldLength }) {
  return (
    <div className="row">
      <div className="input-row">
        {["firstInput","secondInput","thirdInput","fourthInput"].map((name, i) => (
          <input
            key={i}
            type="number"
            className="input-value"
            onInput={checkNumberFieldLength}
            onChange={handleChange(index)}
            name={name}
            value={row.inputValues[name] || ""}
            disabled={row.inputValues.disabledFlag}
            readOnly
          />
        ))}
      </div>
      <div className="clicks-clacks-row">
        <label className="clicks">{row.inputValues.clicksValue}</label>
        <label className="clacks">{row.inputValues.clacksValues}</label>
      </div>
    </div>
  );
}