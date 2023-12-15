import React, { ForwardedRef } from "react";
import { Component } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

let doit = false;

interface Props {
  width: string;
  height: string;
  onScoreChanged: (new_score: number) => void;
  resets: number;
}

var intervalVariable = 0;
var paused = false;

const Canvas = forwardRef((props: Props, ref: ForwardedRef<unknown>) => {
  useImperativeHandle(ref, () => {
    return {
      resetGame: resetGame,
    };
  });

  const canvasRef = useRef(null);

  let [score, setScore] = useState(0);

  let [resets, setResets] = useState(0);

  let [x, setX] = useState(200); // starting horizontal position of ball
  let [y, setY] = useState(150); // starting vertical position of ball

  let [dx, setDx] = useState(1); // amount ball should move horizontally
  let [dy, setDy] = useState(-3); // amount ballshould move vertically

  let [paddleh, setPaddleh] = useState(10); // paddle height
  let [paddlew, setPaddlew] = useState(75); // paddle width

  let [nrows, setNrows] = useState(6); // number of rows of bricks
  let [ncols, setNcols] = useState(6); // number of columns of bricks

  let [brickHeight, setBrickHeight] = useState(15); // height of each brick

  let [padding, setPadding] = useState(1); // how far apart bricks are spaced

  let [ballradius, setBallRadius] = useState(10); // size of ball (in pixels)

  let [brick_colors, setBrickColors] = useState([
    "#bb070e",
    "#f11712",
    "#ffe63a",
    "#0099f7",
    "#34f9fe",
  ]);

  let [paddlecolor, setPaddleColor] = useState("black");
  let [ballcolor, setBallColor] = useState("black");
  let [backcolor, setBackColor] = useState("grey");

  let [width, setWidth] = useState(0);
  let [height, setHeight] = useState(0);
  let [paddlex, setPaddleX] = useState(width / 2);
  let [bricks, setBricks] = useState(null);
  let [brickWidth, setBrickWidth] = useState(width / ncols - 1);

  let [canvasMinX, setCanvasMinX] = useState(0); // minimum canvas x bounds
  let [canvasMaxX, setCanvasMaxX] = useState(0); // maximum cavnas x bounds

  let [initialized, setInitialized] = useState(false);

  const circle = useCallback((x, y, r) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000000";
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  }, []);

  // used to draw each brick & the paddle
  const rect = useCallback((x, y, w, h) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
  }, []);

  // clear the screen in between drawing each animation
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
    rect(0, 0, width, height);
  }, []);

  const getOffsetLeft = useCallback((elem: HTMLElement) => {
    var offsetLeft = 0;
    do {
      if (!isNaN(elem.offsetLeft)) {
        offsetLeft += elem.offsetLeft;
      }
    } while ((elem = elem.offsetParent));
    return offsetLeft;
  }, []);

  const init_bricks = useCallback(() => {
    bricks = new Array(nrows);
    for (let i = 0; i < nrows; i++) {
      // for each row of bricks
      bricks[i] = new Array(ncols);
      for (let j = 0; j < ncols; j++) {
        // for each column of bricks
        bricks[i][j] = true;
      }
    }
  }, []);

  const draw_bricks = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    for (let i = 0; i < nrows; i++) {
      // for each row of bricks
      for (let j = 0; j < ncols; j++) {
        // for each column of bricks
        // set the colors to alternate through
        // all colors in brick_colors array
        // modulus (%, aka remainder) ensures the colors
        // rotate through the whole range of brick_colors
        context.fillStyle = brick_colors[(i + j) % brick_colors.length];
        if (bricks[i][j]) {
          rect(
            j * (brickWidth + padding) + padding,
            i * (brickHeight + padding) + padding,
            brickWidth,
            brickHeight
          );
        } // else if bricks[i][j] is false it's already been hit
      }
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;

    if (doit) {
      x = 250;
      y = 150;
      doit = false;
    }
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    // before drawing, change the fill color
    context.fillStyle = backcolor;
    clear();

    // draw the ball
    context.fillStyle = ballcolor;
    circle(x, y, ballradius);

    // draw the paddle
    context.fillStyle = paddlecolor;
    rect(paddlex, height - paddleh, paddlew, paddleh);

    draw_bricks();

    //check if we have hit a brick
    let rowheight = brickHeight + padding;
    let colwidth = brickWidth + padding;
    let row = Math.floor(y / rowheight);
    let col = Math.floor(x / colwidth);
    //if so reverse the ball and mark the brick as broken
    if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
      dy = -dy;
      bricks[row][col] = false;
      score = score + 1;
      update_score_text();
    }

    //contain the ball by rebouding it off the walls of the canvas
    if (x + dx > width || x + dx < 0) dx = -dx;

    if (y + dy < 0) {
      dy = -dy;
    } else if (y + dy > height - paddleh) {
      // check if the ball is hitting the
      // paddle and if it is rebound it
      if (x > paddlex && x < paddlex + paddlew) {
        dy = -dy;
      }
    }
    if (y + dy > height) {
      //game over, so stop the animation
      stop_animation();
    }
    x += dx;
    y += dy;
  }, []);

  const onMouseMove = useCallback((evt: Event) => {
    // set the paddle position if the mouse position
    // is within the borders of the canvas
    if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
      paddlex = Math.max(evt.pageX - canvasMinX - paddlew / 2, 0);
      paddlex = Math.min(width - paddlew, paddlex);
    }
  }, []);

  const update_score_text = useCallback(() => {
    props.onScoreChanged(score);
  }, []);

  const start_animation = () => {
    intervalVariable = setInterval(draw, 13);
  };

  const stop_animation = () => {
    clearInterval(intervalVariable);
  };

  const onKeyPress = useCallback((evt: Event) => {
    if (paused == true) {
      start_animation();
      paused = false;
    } else {
      stop_animation();
      paused = true;
    }
  }, []);

  const init = useCallback(() => {
    reset();

    // setup pause handling
    document.addEventListener("keypress", onKeyPress, true);
    document.addEventListener("mousemove", onMouseMove);
  });

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    //get a reference to the canvas
    paddlex = width / 2;
    brickWidth = width / ncols - 1;

    canvasMinX = getOffsetLeft(canvas);
    canvasMaxX = canvasMinX + innerWidth;

    setCanvasMinX(canvasMinX);
    setCanvasMaxX(canvasMaxX);

    // run draw function every 6 milliseconds to give
    // the illusion of movement
    init_bricks();
    start_animation();

    score = 0;
    props.onScoreChanged(0);
  }, []);

  useEffect(() => {
    init();
  }, [initialized]);

  const resetGame = useCallback(() => {
    doit = true;
    reset();
  });

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
});

export default Canvas;
