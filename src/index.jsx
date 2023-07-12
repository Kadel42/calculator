import React, { useState } from "react";
import ReactDOM from "react-dom/client";

let inputs = [0];

function calculateSmart() {
  if (inputs.length === 1) {
    inputs.push("=");
  } else {
    while (inputs.includes("*")) {
      let element =
        inputs[inputs.indexOf("*") - 1] * inputs[inputs.indexOf("*") + 1];
      inputs.splice(inputs.indexOf("*") - 1, 3, element);
    }
    while (inputs.includes("/")) {
      let element =
        inputs[inputs.indexOf("/") - 1] / inputs[inputs.indexOf("/") + 1];
      inputs.splice(inputs.indexOf("/") - 1, 3, element);
    }
    while (inputs.includes("+")) {
      let element =
        inputs[inputs.indexOf("+") - 1] + inputs[inputs.indexOf("+") + 1];
      inputs.splice(inputs.indexOf("+") - 1, 3, element);
    }
    while (inputs.includes("-")) {
      let element =
        inputs[inputs.indexOf("-") - 1] - inputs[inputs.indexOf("-") + 1];
      inputs.splice(inputs.indexOf("-") - 1, 3, element);
    }
    inputs.push("=");
  }
}

// function calculate() {
//   let result = 0;
//   let operator = "+";

//   for (let i = 0; i < inputs.length; i++) {
//     if (typeof inputs[i] === "number") {
//       if (operator === "+") {
//         result += inputs[i];
//       } else if (operator === "-") {
//         result -= inputs[i];
//       } else if (operator === "*") {
//         result *= inputs[i];
//       } else if (operator === "/") {
//         result /= inputs[i];
//       }
//     } else {
//       operator = inputs[i];
//     }
//   }

//   inputs = [result, "="];
// }

function App() {
  const [displayText, setDisplayText] = useState("0");

  function handleClick(button) {
    let last = inputs.length - 1;
    switch (button) {
      case "clr":
        setDisplayText("0");
        inputs = [0];
        break;

      case "+":
      case "*":
      case "/":
        if (inputs[last] === "=") {
          inputs.pop();
          last = inputs.length - 1;
        }
        if (inputs[last] === ".") {
          inputs.pop();
          last = inputs.length - 1;
          if (Number(inputs[last])) {
            inputs[last] = Number(inputs[last]);
          } else {
            inputs.push(0);
            inputs.push(button);
            break;
          }
        }
        if (
          inputs[last] === "*" ||
          inputs[last] === "/" ||
          inputs[last] === "+" ||
          inputs[last] === "-"
        ) {
          inputs.pop();
        } else if (inputs[last] === "N") {
          inputs.pop();
          inputs.pop();
        }
        inputs.push(button);
        break;
      case "-":
        if (inputs[last] === "=") {
          inputs.pop();
          last = inputs.length - 1;
        }
        if (inputs[last] === ".") {
          inputs.pop();
          last = inputs.length - 1;
          inputs[last] = Number(inputs[last]);
        }
        if (
          inputs[last] === "*" ||
          inputs[last] === "/" ||
          inputs[last] === "+" ||
          inputs[last] === "-"
        ) {
          inputs.push("N");
          break;
        }
        inputs.push(button);
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if (inputs[last] === "=") {
          inputs.pop();
          last = inputs.length - 1;
          inputs[last] = 0;
        }
        if (inputs[last] === 0 && button === "0") {
          break;
        } else if (typeof inputs[last] === "number") {
          inputs[last] = Number(inputs[last] + button);
          setDisplayText(inputs[last].toString());
        } else if (inputs[last] === ".") {
          if (/\./.test(inputs[last - 1].toString())) {
            inputs[last - 1] = inputs[last - 1] + button;
          } else {
            if (inputs[last - 1] === "N") {
              inputs[last - 1] = "-0." + button;
            } else if (
              inputs[last - 1] === "+" ||
              inputs[last - 1] === "-" ||
              inputs[last - 1] === "*" ||
              inputs[last - 1] === "/"
            ) {
              inputs.pop();
              inputs.push("0." + button);
              inputs.push(".");
              last = inputs.length - 1;
            } else {
              inputs[last - 1] = inputs[last - 1] + "." + button;
            }
          }
          setDisplayText(inputs[last - 1].toString());
        } else if (
          inputs[last] === "*" ||
          inputs[last] === "/" ||
          inputs[last] === "+" ||
          inputs[last] === "-"
        ) {
          inputs.push(Number(button));
          setDisplayText(inputs[last + 1]);
        } else if (inputs[last] === "N") {
          inputs.pop();
          inputs.push(Number("-" + button));
          setDisplayText(inputs[last].toString());
        }
        break;

      case "=":
        if (inputs[last] === ".") {
          inputs.pop();
          last = inputs.length - 1;
          if (inputs[last] === "N") {
            inputs.pop();
            last = inputs.length - 1;
          }
          if (Number(inputs[last])) {
            inputs[last] = Number(inputs[last]);
          } else {
            inputs.push(0);
            last = inputs.length - 1;
          }
        }
        if (inputs[last] === "N") {
          inputs.pop();
          last = inputs.length - 1;
        }
        if (typeof inputs[last] !== "number") {
          inputs.pop();
          last = inputs.length - 1;
        }
        calculateSmart();
        setDisplayText(inputs[0]);
        break;

      case ".":
        if (inputs[last] === "=") {
          inputs.pop();
          last = inputs.length - 1;
          inputs[last] = 0;
        }
        if (inputs[last] !== ".") {
          inputs.push(".");
          if (
            inputs[last] === "+" ||
            inputs[last] === "-" ||
            inputs[last] === "/" ||
            inputs[last] === "*" ||
            inputs[last] === "N" ||
            inputs[last] === 0
          ) {
            setDisplayText("0.");
          }
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className="calculator">
      <Display displayText={displayText} />
      <Keypad onButtonClick={handleClick} />
    </div>
  );
}

function Display(props) {
  return <p id="display">{props.displayText}</p>;
}

function Keypad(props) {
  return (
    <div className="keypad">
      <button id="clear" onClick={() => props.onButtonClick("clr")}>
        CE
      </button>
      <button id="divide" onClick={() => props.onButtonClick("/")}>
        /
      </button>
      <button id="multiply" onClick={() => props.onButtonClick("*")}>
        *
      </button>
      <button id="seven" onClick={() => props.onButtonClick("7")}>
        7
      </button>
      <button id="eight" onClick={() => props.onButtonClick("8")}>
        8
      </button>
      <button id="nine" onClick={() => props.onButtonClick("9")}>
        9
      </button>
      <button id="subtract" onClick={() => props.onButtonClick("-")}>
        -
      </button>
      <button id="four" onClick={() => props.onButtonClick("4")}>
        4
      </button>
      <button id="five" onClick={() => props.onButtonClick("5")}>
        5
      </button>
      <button id="six" onClick={() => props.onButtonClick("6")}>
        6
      </button>
      <button id="add" onClick={() => props.onButtonClick("+")}>
        +
      </button>
      <button id="one" onClick={() => props.onButtonClick("1")}>
        1
      </button>
      <button id="two" onClick={() => props.onButtonClick("2")}>
        2
      </button>
      <button id="three" onClick={() => props.onButtonClick("3")}>
        3
      </button>
      <button id="equals" onClick={() => props.onButtonClick("=")}>
        =
      </button>
      <button id="zero" onClick={() => props.onButtonClick("0")}>
        0
      </button>
      <button id="decimal" onClick={() => props.onButtonClick(".")}>
        .
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App></App>);
