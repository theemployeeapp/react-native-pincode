import { useEffect, useRef } from 'react';
import React = require("react");

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
