import "./Drawing.css";
import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  TOOL_PENCIL,
  Clear,
  TOOL_CLEAR,
  Ellipse,
  TOOL_ELLIPSE,
  Rectangle,
  TOOL_RECTANGLE,
} from "./tools";
import { useCanvasStore } from "../../../store/canvas/useCanvasStore";
import useSocketStore from "../../../store/socket/useSocketStore.js";
import useCatchLiarStore from "../../../store/game/useCatchLiarStore.js";
import useRoomStore from "../../../store/room/useRoomStore.js";

const ERASE = "erase";

const toolsMap = {
  [TOOL_PENCIL]: Pencil,
  [TOOL_CLEAR]: Clear,
  [TOOL_RECTANGLE]: Rectangle,
  [TOOL_ELLIPSE]: Ellipse,
  [ERASE]: Pencil,
};

const Drawing = ({ zIndex, position }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const toolRef = useRef(null);
  let isClick = false;

  const { socket } = useSocketStore();
  const { tool, color, size, fillColor, clearBtnClick, setCanvas, setTool } = useCanvasStore();
  const { roomId } = useRoomStore();
  const { isDrawing } = useCatchLiarStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvas);
    ctxRef.current = canvas.getContext("2d");
  }, []);

  useEffect(() => {
    initTool(tool);
    if (tool === ERASE) {
      ctxRef.current.strokeStyle = color;
    }
    if (tool === TOOL_CLEAR) {
      toolRef.current.clearCanvas(1200, 750);
      socket?.emit("drawer_draw_start", {tool, roomId});
      setTool(TOOL_PENCIL);
    }
  }, [tool]);

  useEffect(() => {
    socket?.on("drawer_draw_start", handleDrawerDrawStart);
    socket?.on("drawer_draw_move", handleDrawerDrawMove);

    return () => {
      socket?.off("drawer_draw_start", handleDrawerDrawStart);
      socket?.off("drawer_draw_move", handleDrawerDrawMove);
    };
  }, [socket]);

  const initTool = (tool) => {
    toolRef.current = toolsMap[tool](ctxRef.current);
  };

  const getCursorPosition = (e) => {
    const { top, left } = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - left,
      y: e.clientY - top,
    };
  };

  // 인자가 필요 없을 경우?
  const onMouseDown = (e) => {
    isClick = true;
    const { x, y } = getCursorPosition(e);

    if (tool === TOOL_PENCIL) {
      toolRef.current.onMouseDown(x, y, color, size);
    } else if (tool === ERASE) {
      toolRef.current.onMouseDown(x, y, "white", size);
    } else {
      toolRef.current.onMouseDown(x, y, color, size, fillColor);
    }

    if (isDrawing) {
      socket?.emit("drawer_draw_start", {tool, xAxis: x, yAxis: y, color, size, fillColor, roomId,});
    }
  };

  const onMouseUp = (e) => {
    isClick = false;
    const { x, y } = getCursorPosition(e);
    toolRef.current.onMouseUp(x, y);
  };

  const onMouseMove = (e) => {
    if (!isClick) return;
    const { x, y } = getCursorPosition(e);
    toolRef.current.onMouseMove(x, y);

    if (isDrawing) {
      socket?.emit("drawer_draw_move", { tool, xAxis: x, yAxis: y, color, size, fillColor, roomId});
    }
  };

  const onMouseOut = (e) => {
    const { x, y } = getCursorPosition(e);
    toolRef.current.onMouseUp(x, y);
  };

  const handleDrawerDrawStart = (data) => {
    const { tool, xAxis, yAxis, color, size, fillColor } = data;
    if (tool === TOOL_CLEAR) {
      Clear(ctxRef.current).clearCanvas(1200, 750);
      return;
    }

    initTool(tool);

    if (tool === TOOL_PENCIL) {
      toolRef.current.onMouseDown(xAxis, yAxis, color, size);
    } else if (tool === ERASE) {
      toolRef.current.onMouseDown(xAxis, yAxis, "white", size);
    } else {
      toolRef.current.onMouseDown(xAxis, yAxis, color, size, fillColor);
    }
  };

  const handleDrawerDrawMove = (data) => {
    const { tool, xAxis, yAxis, color, size, fillColor } = data;
    toolRef.current.onMouseMove(xAxis, yAxis);
  };


  return (
    <>
      <canvas
        width={1200}
        height={750}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        style={{
          backgroundColor: "transparent",
          position: position,
          zIndex: zIndex,
        }}
      />
    </>
  );
};

export default Drawing;
