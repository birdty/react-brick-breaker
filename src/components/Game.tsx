import React from "react";

import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Canvas from "./Canvas";

export default function Game() {
  const childRef = useRef();

  let [score, setScore] = useState(0);

  const reset = useCallback((event: Event) => {
    event.preventDefault();
    childRef.current.reset();
  }, []);

  const onScoreChanged = useCallback((new_score) => {
    setScore(new_score);
  }, []);

  return (
    <center>
      <Canvas
        width="500"
        height="300"
        onScoreChanged={onScoreChanged}
        ref={childRef}
      ></Canvas>
      <p>Mouse moves platform &bull; Press any key to pause</p>
      <button onClick={reset}>Play again</button>
      <div>
        <div id="score">Score: {score}</div>
      </div>
    </center>
  );
}
