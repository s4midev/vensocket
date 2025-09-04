/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";
import { copyToClipboard } from "@utils/clipboard";
import { Devs } from "@utils/constants";
import definePlugin, { PluginNative } from "@utils/types";
import {
    Button,
    Text,
    TextInput,
    Toasts,
    useEffect,
    useState,
} from "@webpack/common";

const dsKey = "vensocket-key";

async function getKey(): Promise<string> {
    return (await DataStore.get<string>(dsKey)) ?? genAndSetKey();
}

function genAndSetKey(): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // wowzer, i have a serious mental illness
    const key = new Array(32)
        .fill("")
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("");

    DataStore.set(dsKey, key);

    return key;
}

const Native = VencordNative.pluginHelpers.VenSocket as PluginNative<
    typeof import("./native")
>;

// the horror is real but i genuinely couldn't find an alternative
let actionCache: {
    handleToggleSelfMute: any;
    handleToggleSelfDeaf: any;
};

const actions = {
    mute: () => actionCache.handleToggleSelfMute(),
    deafen: () => actionCache.handleToggleSelfDeaf(),
};

export default definePlugin({
    name: "VenSocket",
    description: "My attempt at a ws api for discord",
    authors: [Devs.Samwich],
    updateCache(cache: any) {
        actionCache = cache;
    },
    patches: [
        {
            find: 'this,"handleToggleSelfMute"',
            replacement: {
                match: /\i\(this,"copiedTimeout",/,
                replace: "$self.updateCache(this); $&"
            }
        }
    ],
    settingsAboutComponent: () => {
        const [key, setKey] = useState<string>("");

        const updateKey = async () => setKey(await getKey());

        useEffect(() => {
            updateKey();
        }, []);

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}
            >
                <Text>Your API Key</Text>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "0.5rem",
                    }}
                >
                    <TextInput
                        disabled={true}
                        value={key.replaceAll(/./g, "*")}
                        width={"fit"}
                    />
                    <Button
                        color={Button.Colors.GREEN}
                        onClick={async () => await copyToClipboard(key)}
                    >
                        Copy
                    </Button>
                    <Button
                        color={Button.Colors.YELLOW}
                        onClick={() => {
                            genAndSetKey(), updateKey();
                            Toasts.show({
                                id: Toasts.genId(),
                                message: "Successfully regenerated API key :3",
                                type: Toasts.Type.SUCCESS,
                            });
                        }}
                    >
                        Regen
                    </Button>
                </div>
            </div>
        );
    },
    async start() {
        await Native.startServer(await getKey());
        setInterval(async () => {
            const act = await Native.getActions();

            act.forEach(async a => {
                if (actions?.[a]) {
                    actions[a]();
                } else console.warn(`Action ${a} requested, but not defined`);
            });
        }, 100);
    },
});
