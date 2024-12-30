"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider(props) {
  const { children, ...restProps } = props;
  return <NextThemesProvider {...restProps}>{children}</NextThemesProvider>;
}
