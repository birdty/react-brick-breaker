import React from "react";
import { useState } from "react";
import $ from "jquery";
import Canvas from "./Canvas";

export default function Game() {
  function reload() {}

  return (
    <center>
      <Canvas width="300" height="300"></Canvas>
      <p>Mouse moves platform &bull; Press any key to pause</p>
      <button onClick={reload}>Play again</button>
      <div>
        Here
        <div id="score"></div>
      </div>
    </center>
  );
}
