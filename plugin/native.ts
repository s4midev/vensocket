/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5777 });

let act: string[] = [];

export function getActions(): string[] {
    const oldAct = [...act];
    act = [];
    return oldAct;
}

export function startServer(...args) {
    const key = args[1];

    wss.on("connection", ws => {
        let hasAuthed = false;

        ws.send("hihi, drop the api key");

        ws.on("message", message => {
            const msgStr = message.toString();

            console.log(msgStr);

            if(hasAuthed) {
                act.push(msgStr);
            } else {
                if(msgStr === key) {
                    hasAuthed = true;
                    ws.send("welcome to the cool club");
                } else {
                    ws.send("nope");
                }
            }
        });

        ws.on("close", () => console.log("Client disconnected."));
    });
}
