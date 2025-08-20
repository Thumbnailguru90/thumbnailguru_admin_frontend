// components/AppToaster.js
import { Toaster, Position } from "@blueprintjs/core";
import React from "react";

export const AppToaster = React.memo(() => {
  return <Toaster position={Position.TOP_RIGHT} />;
});

export const toaster = Toaster.create({
  position: Position.TOP_RIGHT,
});
