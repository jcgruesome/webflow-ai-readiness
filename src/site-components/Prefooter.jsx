"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import { Button } from "./Button";

export function Prefooter(
    {
        as: _Component = _Builtin.Section
    }
) {
    return (
        <_Component
            className="prefooter"
            grid={{
                type: "section"
            }}
            tag="section"><_Builtin.Block className="global-padding" tag="div"><_Builtin.BlockContainer
                    className="container-2 light-3"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><_Builtin.Grid className="content-wrapper" tag="div"><_Builtin.VFlex
                            className="flex-block centered-light"
                            id="w-node-fa362256-039a-6d3d-e3b4-3a09dea24e1b-dea24e17"
                            tag="div"><_Builtin.VFlex
                                className="heading-container centered-light-2"
                                id="w-node-fa362256-039a-6d3d-e3b4-3a09dea24e1c-dea24e17"
                                tag="div"><_Builtin.Heading className="heading-section-9 centered-light-4" tag="h1">{"While You're Thinking About AI, Your Competitors Are Already Using It"}</_Builtin.Heading></_Builtin.VFlex><_Builtin.Paragraph className="paragraph-2">{"Everyone's racing to deploy AI right now. The companies winning aren't using ChatGPT—they're building custom agents trained on their operations. If you're still manual, you're not just slower. You're losing deals to competitors who respond in minutes while you take days."}</_Builtin.Paragraph><_Builtin.Block className="button-wrapper centered-light-6" tag="div"><Button
                                    variant="Base"
                                    text="See How We Work"
                                    link={{
                                        href: "#"
                                    }}
                                    visibility={false} /><Button
                                    variant="Black"
                                    text="See How We Work"
                                    link={{
                                        href: "#"
                                    }}
                                    visibility={true} /></_Builtin.Block><_Builtin.Paragraph className="paragraph centered-light-5">{"See where you're behind. Get a working demo. Close the gap in weeks."}</_Builtin.Paragraph></_Builtin.VFlex></_Builtin.Grid></_Builtin.BlockContainer></_Builtin.Block></_Component>
    );
}