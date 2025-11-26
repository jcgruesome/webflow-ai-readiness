"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function Button(
    {
        as: _Component = _Builtin.Link,
        variant = "Base",
        text = "See How We Work",

        link = {
            href: "#"
        },

        visibility = true
    }
) {
    const _styleVariantMap = {
        "Base": "",
        "Secondary": "w-variant-b91df045-5057-ad9f-d140-0e5b786759ad",
        "Black": "w-variant-d91aa298-e698-b0b3-152a-f29ef69c36f2"
    };

    const _activeStyleVariant = _styleVariantMap[variant];

    return visibility ? <_Component
        className={`button ${_activeStyleVariant}`}
        button={false}
        block="inline"
        options={link}><_Builtin.Block tag="div">{text}</_Builtin.Block></_Component> : null;
}