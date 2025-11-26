"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-179":{"id":"e-179","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-22","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-180"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"09f777f3-b0a3-0e7e-96b3-0d3384b73a57","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"09f777f3-b0a3-0e7e-96b3-0d3384b73a57","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1761676468809},"e-181":{"id":"e-181","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-22","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-182"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"68f6694781e72a28f7fd8ce1|f218494d-92aa-3e34-29d5-e812719f8f58","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"68f6694781e72a28f7fd8ce1|f218494d-92aa-3e34-29d5-e812719f8f58","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1761677980150},"e-381":{"id":"e-381","name":"","animationType":"preset","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-22","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-382"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"6903a1d345e7c85dc954d1df|f218494d-92aa-3e34-29d5-e812719f8f58","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"6903a1d345e7c85dc954d1df|f218494d-92aa-3e34-29d5-e812719f8f58","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1761845715488}},"actionLists":{"a-22":{"id":"a-22","title":"modal open","actionItemGroups":[{"actionItems":[{"id":"a-22-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"PARENT","selector":".modal-contact","selectorGuids":["b4c86bbc-6faa-4923-ce59-3a09e12df260"]},"value":"none"}},{"id":"a-22-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".modal-contact","selectorGuids":["b4c86bbc-6faa-4923-ce59-3a09e12df260"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-22-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":[0.165,0.84,0.44,1],"duration":250,"target":{"selector":".modal-contact","selectorGuids":["b4c86bbc-6faa-4923-ce59-3a09e12df260"]},"value":1,"unit":""}},{"id":"a-22-n-3","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"PARENT","selector":".modal-contact","selectorGuids":["b4c86bbc-6faa-4923-ce59-3a09e12df260"]},"value":"block"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1761675756181}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Section(
    {
        as: _Component = _Builtin.Section,
        variant = "Dark"
    }
) {
    _interactions.useInteractions(_interactionsData);

    const _styleVariantMap = {
        "Dark": "",
        "Light": "w-variant-deb1afb0-ed2b-7be4-87a2-4283e5622341"
    };

    const _activeStyleVariant = _styleVariantMap[variant];

    return (
        <_Component
            className={`modal-contact ${_activeStyleVariant}`}
            grid={{
                type: "section"
            }}
            tag="section"><_Builtin.Block className={`global-padding ${_activeStyleVariant}`} tag="div"><_Builtin.BlockContainer
                    className={`container-2 ${_activeStyleVariant}`}
                    grid={{
                        type: "container"
                    }}
                    tag="div"><_Builtin.Grid className={`content-wrapper ${_activeStyleVariant}`} tag="div" /></_Builtin.BlockContainer></_Builtin.Block></_Component>
    );
}