import * as React from "react";
import * as Types from "./types";

declare function TextBlock(
    props: {
        as?: React.ElementType;
        variant?: "Base" | "Dark" | "Light" | "Centered light";
        headingTag?: Types.Basic.HeadingTag;
        headingTitle?: React.ReactNode;
        bodyText?: React.ReactNode;
        buttonsVisibility?: Types.Visibility.VisibilityConditions;
        buttonsBtn1Variant?: "Base" | "Secondary" | "Black";
        buttonsBtn1Text?: React.ReactNode;
        buttonsBtn1Link?: Types.Basic.Link;
        buttonsBtn2Variant?: "Base" | "Secondary" | "Black";
        buttonsBtn2Text?: React.ReactNode;
        buttonsBtn2Link?: Types.Basic.Link;
        buttonsBtn1Visibility?: Types.Visibility.VisibilityConditions;
        buttonsBtn2Visibility?: Types.Visibility.VisibilityConditions;
        kickerVariant?: "Base" | "Ice" | "Ice transluscent";
        kickerText?: React.ReactNode;
    }
): React.JSX.Element