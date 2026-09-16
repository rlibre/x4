const OWNER = "rlibre";
const REPO = "x4-templates";
const REF = "main";

function headers(version = "unknown") {
    return {
        "Accept": "application/vnd.github+json",
        "User-Agent": `x4js/${version}`,
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

async function checkedFetch(url, options) {
    const response = await fetch(url, options);
    if (!response.ok)
        throw new Error(`Template repository request failed (${response.status} ${response.statusText})`);
    return response;
}

export async function fetchTemplates(version = "unknown") {
    const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}/templates.json`;
    const response = await checkedFetch(url, { headers: headers(version) });
    const manifest = await response.json();

    if (!manifest || typeof manifest !== "object" || Array.isArray(manifest))
        throw new Error("Invalid templates.json");

    for (const [name, description] of Object.entries(manifest)) {
        if (!name || typeof description !== "string")
            throw new Error("Invalid templates.json entry");
    }

    return manifest;
}

export async function fetchTemplateFiles(name, version = "unknown") {
    const treeUrl = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${REF}?recursive=1`;
    const response = await checkedFetch(treeUrl, { headers: headers(version) });
    const tree = await response.json();

    if (!Array.isArray(tree.tree))
        throw new Error("Invalid template repository tree");

    const prefix = `${name}/`;
    const files = tree.tree
        .filter((item) => item.type === "blob" && item.path.startsWith(prefix))
        .map((item) => ({
            path: item.path.slice(prefix.length),
            url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}/${item.path.split("/").map(encodeURIComponent).join("/")}`,
        }));

    if (!files.length)
        throw new Error(`Template '${name}' contains no files`);

    return files;
}

export async function downloadTemplateFile(url, version = "unknown") {
    const response = await checkedFetch(url, { headers: headers(version) });
    return Buffer.from(await response.arrayBuffer());
}
