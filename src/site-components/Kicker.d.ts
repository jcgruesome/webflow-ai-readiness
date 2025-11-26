import * as React from "react";
import * as Types from "./types";

declare function Kicker(
    props: {
        as?: React.ElementType;
        variant?: "Base" | "Ice" | "Ice transluscent";
        text?: React.ReactNode;
    }
): React.JSX.Element