import React from "react";
import "./Form.css";

function Form({startGame}) {
  return (
    <form className="cherry-blossom-form">
      <label htmlFor="difficulty">Choose a Difficulty</label>
      <select id="difficulty">
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          startGame(e);
        }}
      >
        Start!
      </button>
    </form>
  );
}

export default Form;
