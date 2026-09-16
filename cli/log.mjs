import { styleText } from "node:util";

function useColor(stream = process.stdout) {
    if (process.env.NO_COLOR !== undefined)
        return false;
    if (process.env.FORCE_COLOR !== undefined)
        return process.env.FORCE_COLOR !== "0";
    return !!stream.isTTY;
}

function paint(style, value, stream = process.stdout) {
    const text = String(value);
    return useColor(stream) ? styleText(style, text) : text;
}

export const color = {
    cyan: (value) => paint("cyan", value),
    green: (value) => paint("green", value),
    yellow: (value) => paint("yellow", value),
    red: (value) => paint("red", value, process.stderr),
    gray: (value) => paint("gray", value),
    white: (value) => paint("white", value),
};

export function info(label, value = "") {
    const left = color.cyan(String(label).padEnd(11));
    console.log(value === "" ? left.trimEnd() : `${left}${value}`);
}

export function success(label, value = "") {
    const left = color.green(String(label).padEnd(11));
    console.log(value === "" ? left.trimEnd() : `${left}${value}`);
}

export function warning(message) {
    console.warn(color.yellow(message));
}

export function failure(message) {
    console.error(color.red(message));
}
