import React from "react"
import { useNavigate } from "react-router-dom";

export default function CrackyHome() {
    const navigate = useNavigate();

    return (
        <div>
            {/* title */}
            <div className="title-label">
                <h1>CRACKY</h1>
            </div>
            <br></br>

            {/* instructions */}
            <div className="home-instructions">
                <h2>How to CRACK</h2>
                <h4>Crack the code in the least number of guesses!</h4>
                - The number of clicks and clacks will be given to show how close your guess was to the code.<br></br>
                - Clicks = correct digit, correct position <br></br>
                - Clacks = correct digit, incorrect position <br></br>
                <h4>Examples</h4>
                <p>9638 = 0 clicks, 1 clacks <br></br>
                1 of these digits is correct and in the incorrect position.</p>
                <p>2834 = 1 clicks, 0 clacks <br></br>
                1 of these digits is correct and in the correct position. </p>
                <p>5107 = 2 clicks, 2 clacks <br></br>
                2 of these digits are correct and in the correct position, and the other 2 digits are correct but in the incorrect position.</p>
                <br></br>
                <h2>Modes</h2>
                <p>CRACKY Classic: Unlimited guesses <br></br>CRACKY Survival: Limited guesses — use them wisely!</p>
            </div>
            <br></br>

            {/* buttons */}
            <div className="home-buttons">
                <button id="navigateToCrackyClassicButton" type="button" onClick={() => navigate("/classic")}>
                    CRACKY Classic
                </button>
                <button id="navigateToCrackySurvivalButton" type="button" onClick={() => navigate("/survival")}>
                    CRACKY Survival
                </button>
            </div>
        </div>
    )
}