import * as React from "react";
import * as Types from "./types";

declare function Button(
    props: {
        as?: React.ElementType;
        variant?: "Base" | "Secondary" | "Black";
        text?: React.ReactNode;
        link?: Types.Basic.Link;
        visibility?: Types.Visibility.VisibilityConditions;
    }
): React.JSX.Element