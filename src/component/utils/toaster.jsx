// src/utils/toaster.js
import React from "react";
import { Toaster, Position } from "@blueprintjs/core";

import ReactDOM from "react-dom/client";

// Create a ref
export const toasterRef = React.createRef();

// Use this component once in your app root!
export const AppToaster = () => (
  <Toaster ref={toasterRef} position={Position.TOP} />
);
