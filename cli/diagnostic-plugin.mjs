import * as esbuild from "esbuild";
import { styleText } from "node:util";

function useColors() {
    return process.stderr.isTTY && !process.env.NO_COLOR;
}

async function format(messages, kind) {
    if (!messages?.length)
        return [];

    return esbuild.formatMessages(messages, {
        kind,
        color: useColors(),
        terminalWidth: process.stderr.columns || 100,
    });
}

export async function printWarnings(messages) {
    const lines = await format(messages, "warning");

    for (const line of lines)
        process.stderr.write(line);
}

export async function printErrors(messages) {
    if (!messages?.length)
        return;

    console.error(styleText("red", "\nbuild failed\n"));

    const lines = await format(messages, "error");

    for (const line of lines)
        process.stderr.write(line);
}

export async function printBuildError(error) {
    if (error?.errors?.length) {
        await printErrors(error.errors);

        if (error.warnings?.length)
            await printWarnings(error.warnings);

        return;
    }

    // Erreur x4 / Node, pas une erreur esbuild
    console.error(
        styleText(
            "red",
            error instanceof Error ? error.message : String(error)
        )
    );
}

export function diagnosticsPlugin() {
    return {
        name: "x4-diagnostics",

        setup(build) {
            build.onEnd(async (result) => {
                if (result.errors.length) {
                    await printErrors(result.errors);
                    return;
                }

                if (result.warnings.length)
                    await printWarnings(result.warnings);
            });
        },
    };
}