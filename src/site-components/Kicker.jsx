"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function Kicker(
    {
        as: _Component = _Builtin.Block,
        variant = "Base",
        text = "✨ Platform-Powered AI SOLUTIONS"
    }
) {
    const _styleVariantMap = {
        "Base": "",
        "Ice": "w-variant-59ea368a-3ccc-a8f1-c6a7-1fe4bd5f3bab",
        "Ice transluscent": "w-variant-1cd26e99-473d-9260-d5f0-aa99da33eab7"
    };

    const _activeStyleVariant = _styleVariantMap[variant];

    return (
        <_Component
            className={`kicker ${_activeStyleVariant}`}
            id="w-node-_79881926-4363-000a-dba2-0ac90c3c51af-0c3c51af"
            tag="div"><_Builtin.Block className={`text-block-2 ${_activeStyleVariant}`} tag="div">{text}</_Builtin.Block></_Component>
    );
}