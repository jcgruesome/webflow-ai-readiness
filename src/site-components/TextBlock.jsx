"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import { Kicker } from "./Kicker";
import { Button } from "./Button";

export function TextBlock(
    {
        as: _Component = _Builtin.VFlex,
        variant = "Base",
        headingTag = "h1",
        headingTitle = "While You're Thinking About AI, Your Competitors Are Already Using It",
        bodyText = "Everyone's racing to deploy AI right now. The companies winning aren't using ChatGPT—they're building custom agents trained on their operations. If you're still manual, you're not just slower. You're losing deals to competitors who respond in minutes while you take days.",
        buttonsVisibility = true,
        buttonsBtn1Variant = "Base",
        buttonsBtn1Text = "See How We Work",

        buttonsBtn1Link = {
            href: "#"
        },

        buttonsBtn2Variant = null,
        buttonsBtn2Text = "See How We Work",

        buttonsBtn2Link = {
            href: "#"
        },

        buttonsBtn1Visibility = true,
        buttonsBtn2Visibility = true,
        kickerVariant = null,
        kickerText = "How It Works"
    }
) {
    const _styleVariantMap = {
        "Base": "",
        "Dark": "w-variant-fec6895a-f0c5-44a7-c7c5-41a9f21df85c",
        "Light": "w-variant-17e0c285-41e8-76f5-76e2-c9063736ee68",
        "Centered light": "w-variant-b6105dcd-08c5-5b6f-e460-920cbeb8d2f8"
    };

    const _activeStyleVariant = _styleVariantMap[variant];

    return (
        <_Component
            className={`flex-block ${_activeStyleVariant}`}
            id="w-node-_5e9e1e05-a30a-e0a8-4944-0d47421b7662-421b7662"
            tag="div"><_Builtin.VFlex
                className={`heading-container ${_activeStyleVariant}`}
                id="w-node-_5e9e1e05-a30a-e0a8-4944-0d47421b7663-421b7662"
                tag="div"><_Builtin.Block className={`div-block-9 ${_activeStyleVariant}`} tag="div"><Kicker variant={kickerVariant} text={kickerText} /></_Builtin.Block><_Builtin.Heading className={`heading ${_activeStyleVariant}`} tag={headingTag}>{headingTitle}</_Builtin.Heading></_Builtin.VFlex><_Builtin.Paragraph className={`paragraph ${_activeStyleVariant}`}>{bodyText}</_Builtin.Paragraph>{buttonsVisibility ? <_Builtin.Block className={`button-wrapper ${_activeStyleVariant}`} tag="div"><Button
                    variant={buttonsBtn1Variant}
                    text={buttonsBtn1Text}
                    link={buttonsBtn1Link}
                    visibility={buttonsBtn2Visibility} /><Button
                    variant={buttonsBtn2Variant}
                    text={buttonsBtn2Text}
                    link={buttonsBtn2Link}
                    visibility={buttonsBtn1Visibility} /></_Builtin.Block> : null}</_Component>
    );
}