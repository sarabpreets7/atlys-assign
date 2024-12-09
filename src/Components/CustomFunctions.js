import { useEffect, useState, useRef } from "react";
import "../Styles/CustomFunc.css";
import FuncIcon from '../Assets/grp-icon.svg';

function CustomFunctions() {
  const [initialValue, setInitialValue] = useState(2); // initial value
  const [functions, setFunctions] = useState([
    { id: 1, equation: "x^2", output: 0, position: { row: 1, col: 1 } },
    { id: 2, equation: "x+4", output: 0, position: { row: 1, col: 2 } },
    { id: 4, equation: "x*2", output: 0, position: { row: 2, col: 2 } },
    { id: 5, equation: "x^2", output: 0, position: { row: 2, col: 3 } },
    { id: 3, equation: "x^2+20", output: 0, position: { row: 1, col: 3 } }, 
  ]);

  const [finalOutput, setFinalOutput] = useState(0);
  const cardRefs = useRef([]); 
  
  const [lines, setLines] = useState([]);
  
  const customOrder = [1, 2, 4, 5, 3];

  const evaluateEquation = (equation, x) => {
    try {
      const sanitizedEquation = equation.replace(/\^/g, "**");
      return Function("x", `return ${sanitizedEquation}`)(x);
    } catch (error) {
      return NaN; // invalid equation
    }
  };

  const calculateChain = () => {
    let currentInput = parseFloat(initialValue) || 0;

    const updatedFunctions = functions.map((func) => {
      const result = evaluateEquation(func.equation, currentInput);
      currentInput = result; // Pass result to the next function
      return { ...func, output: result };
    });

    setFunctions(updatedFunctions);
    setFinalOutput(currentInput); //final output
  };

  useEffect(() => {
    calculateChain();
  }, [initialValue]);

  useEffect(() => {
    const updateLines = () => {
        const svgContainer = document.querySelector(".link");
        const svgRect = svgContainer?.getBoundingClientRect();
      
        if (!svgContainer || !svgRect) return; // Early exit if container or rect is missing
      
        const newLines = [];
        cardRefs.current.forEach((card, index) => {
          if (!card) return;
      
          const outputElement = card.querySelector(".cards-chaining-output .chaining-circle");
          const nextCard = cardRefs.current[index + 1];
      
          if (!outputElement || !nextCard) return;
      
          const nextInputElement = nextCard.querySelector(".cards-chaining-input .chaining-circle");
          if (!nextInputElement) return;
      
          const outputRect = outputElement.getBoundingClientRect();
          const inputRect = nextInputElement.getBoundingClientRect();
      
          const startX = outputRect.left + outputRect.width / 2 - svgRect.left;
          const startY = outputRect.top + outputRect.height / 2 - svgRect.top;
          const endX = inputRect.left + inputRect.width / 2 - svgRect.left;
          const endY = inputRect.top + inputRect.height / 2 - svgRect.top;
      
          const controlPointX1 = startX + (endX - startX) / 3;
          const controlPointY1 = startY + 50;
          const controlPointX2 = endX - (endX - startX) / 3;
          const controlPointY2 = endY - 50;
      
          newLines.push({
            startX,
            startY,
            controlPointX1,
            controlPointY1,
            controlPointX2,
            controlPointY2,
            endX,
            endY,
          });
        });
      
        setLines(newLines);
      };
  
    updateLines(); 
    window.addEventListener("resize", updateLines);
  
    return () => {
      window.removeEventListener("resize", updateLines);
    };
  }, [functions]);


  return (
    <div className="main-container">
    
        <svg className="link">
            {lines.map((line, idx) => (
                <path
                    key={idx}
                    d={`M${line.startX},${line.startY} C${line.controlPointX1},${line.controlPointY1} ${line.controlPointX2},${line.controlPointY2} ${line.endX},${line.endY}`}
                    stroke="rgba(174, 204, 250, 1)" 
                    fill="none"
                    strokeWidth="6" 
                    strokeLinecap="round" 
                />
            ))}
        </svg>

      <div className="container">
     
      {/* .sort((a, b) => a.id - b.id) */}
        {functions.map((func, index) => (
            <div key={func.id} className={`function-card-container ${index == 0?'first-card':index == (functions.length-1)?'last-card':''}`} style={{
                gridRow: func.position.row,
                gridColumn: func.position.col,
              }}>
        <div
            className="function-card"
            key={func.id}
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <div className="function-title"><img src={FuncIcon} className="function-icon"/>Function {func.id}</div>
            <div className="function-fields-container">
              <div className="field-label">Equation</div>
              <input
                type="text"
                value={func.equation}
                onChange={(e) =>
                  setFunctions((prevFunctions) =>
                    prevFunctions.map((f) =>
                      f.id === func.id
                        ? { ...f, equation: e.target.value }
                        : f
                    )
                  )
                }
                placeholder="Enter equation"
              />
            </div>
            <div className="function-fields-container">
              <div className="field-label">Next Function</div>
              <select disabled>
                <option>
                  {index < functions.length - 1
                    ? `Function ${functions[index + 1].id}`
                    : "Final Output"}
                </option>
              </select>
            </div>
            <div className="cards-chaining-cont">
                <div className="cards-chaining-input">
                <span className="chaining-circle"><span></span></span> input 
                </div>

                <div className="cards-chaining-output">
                    output <span className="chaining-circle"><span></span></span>
                </div>
            </div>
            <div className="output">Output: {func.output}</div>

            
        </div>
        {index == 0 && <div className="initial-value-container">
                    <div className="initial-input">
                        <label>Initial Value (x):</label>
                        <input
                            type="number"
                            value={initialValue}
                            onChange={(e) => setInitialValue(e.target.value)}
                        />
                    </div>
                </div>
                }

                {index ==(functions.length-1) && <div className="final-value-container">
                    <div className="initial-input">
                            <label>Final Output (y):</label>
                            <input
                                type="number"
                                value={finalOutput}
                                
                            />
                        </div>
                    </div>
                }
        </div>
        ))}

        {/* <div className="final-output">
          <h3>Final Output:</h3>
          <div>{finalOutput}</div>
        </div> */}
      </div>
    </div>
  );
}

export default CustomFunctions;