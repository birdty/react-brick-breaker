import React from "react";
import { useState } from "react";
import $ from "jquery";
import Canvas from "./Canvas";
import { useCallback } from "react";
import { useEffect } from "react";
let paused = "false";

const onKeyPress = (evt: Event) => {
  evt.preventDefault();
  if (paused == "false") {
    paused = "true";
  } else {
    paused = "false";
  }

  console.log("game paused:", paused);
  // console.log("game rand:", rand);

  // rand = rand + 1;
  //  setRand(rand);
};

document.addEventListener("keypress", onKeyPress, true);

export default function Game() {
  //  let [paused, setPaused] = useState("false");
  let [keyPressBound, setKeyPressBound] = useState(false);
  let [rand, setRand] = useState(0);

  // keeps track of whether the game is paused (true) or not (false)
  const reload = () => {};

  /*

  const reload = useCallback(() => {
    x = 200; // starting horizontal position of ball
    y = 150; // starting vertical position of ball
    dx = 1; // amount ball should move horizontally
    dy = -3; // amount ball should move vertically
    init();
  });
*/

  /*
  const onKeyPress = useCallback((evt: Event) => {
    evt.preventDefault();
    if (paused == "false") {
      paused = "true";
    } else {
      paused = "false";
    }

    console.log("game paused:", paused);

    console.log("game rand:", rand);
    rand = rand + 1;
    setRand(rand);
  }, []);
*/

  /*
  if (keyPressBound == false) {
    console.log("binding keypress for on keypress");
    document.addEventListener("keypress", onKeyPress, true);
    setKeyPressBound(true);
  }
*/

  return (
    <center>
      <Canvas width="300" height="300" paused={paused}></Canvas>
      <p>Mouse moves platform &bull; Press any key to pause</p>
      <button onClick={reload}>Play again</button>
      <div>
        <div id="score"></div>
      </div>
    </center>
  );
}
