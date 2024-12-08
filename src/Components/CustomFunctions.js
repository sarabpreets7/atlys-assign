import { useEffect, useState, useRef } from "react";
import "../Styles/CustomFunc.css";
import FuncIcon from '../Assets/grp-icon.svg';

function CustomFunctions() {
  const [initialValue, setInitialValue] = useState(2); // Initial value (x)
  const [functions, setFunctions] = useState([
    { id: 1, equation: "x^2", output: 0 },
    { id: 2, equation: "x+4", output: 0 },
    { id: 4, equation: "x*2", output: 0 },
    { id: 3, equation: "x^2+20", output: 0 },
    { id: 5, equation: "x^2", output: 0 },
   
  ]);
  const [finalOutput, setFinalOutput] = useState(0);
  const cardRefs = useRef([]); //store references to the cards
  const [lines, setLines] = useState([]);
  
  const customOrder = [1, 2, 4, 5, 3];

  const evaluateEquation = (equation, x) => {
    try {
      const sanitizedEquation = equation.replace(/\^/g, "**");
      return Function("x", `return ${sanitizedEquation}`)(x);
    } catch (error) {
      return NaN; // Invalid equation
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
    setFinalOutput(currentInput); // Set final output
  };

  useEffect(() => {
    calculateChain();
  }, [initialValue]);

  useEffect(() => {
    const updateLines = () => {
      const svgContainer = document.querySelector(".link");
      const svgRect = svgContainer.getBoundingClientRect(); // Get SVG container offset
  
      const newLines = [];
      cardRefs.current.forEach((card, index) => {
        if (card) {
          const outputElement = card.querySelector(".cards-chaining-output .chaining-circle");
          const nextCard = cardRefs.current[index + 1];
  
          if (nextCard) {
            const nextInputElement = nextCard.querySelector(".cards-chaining-input .chaining-circle");
  
            const outputRect = outputElement.getBoundingClientRect();
            const inputRect = nextInputElement.getBoundingClientRect();
  
            // Calculate positions relative to the SVG container
            const startX = outputRect.left + outputRect.width / 2 - svgRect.left;
            const startY = outputRect.top + outputRect.height / 2 - svgRect.top;
            const endX = inputRect.left + inputRect.width / 2 - svgRect.left;
            const endY = inputRect.top + inputRect.height / 2 - svgRect.top;
  
            // Adjust control points for a smooth curve
            const controlPointX1 = startX + (endX - startX) / 3;
            const controlPointY1 = startY + 50; // Adjust curvature
            const controlPointX2 = endX - (endX - startX) / 3;
            const controlPointY2 = endY - 50; // Adjust curvature
  
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
          }
        }
      });
  
      setLines(newLines);
    };
  
    updateLines(); // Initial calculation
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
                    stroke="rgba(135, 206, 250, 0.8)" // Light blue with slight opacity
                    fill="none"
                    strokeWidth="6" // Thicker stroke for better visibility
                    strokeLinecap="round" // Rounded edges for smooth curves
                />
            ))}
        </svg>

      <div className="container">
     
      {/* .sort((a, b) => a.id - b.id) */}
        {functions.map((func, index) => (
            <div className={`function-card-container ${index == 0?'first-card':index == (functions.length-1)?'last-card':''}`}>
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
                                value={functions[functions.length-1].output}
                                
                            />
                        </div>
                    </div>
                }
        </div>
        ))}

        <div className="final-output">
          <h3>Final Output:</h3>
          <div>{finalOutput}</div>
        </div>
      </div>
    </div>
  );
}

export default CustomFunctions;