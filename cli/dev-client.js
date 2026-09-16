import copyState from "x4:copy-state";

// Keep the copy-state module in the bundle so changes to copied files also
// produce a changed JS output and therefore a live-reload event.
const events = new EventSource("/esbuild");
Object.defineProperty(events, "__x4CopyState", { value: copyState });

events.addEventListener("change", (event) => {
    const change = JSON.parse(event.data);
    const changed = [...change.added, ...change.removed, ...change.updated];

    if (
        change.added.length === 0 &&
        change.removed.length === 0 &&
        change.updated.length > 0 &&
        change.updated.every((file) => file.endsWith(".css"))
    ) {
        const pending = new Set(change.updated);
        const links = document.querySelectorAll('link[rel="stylesheet"]');

        for (const link of links) {
            const current = new URL(link.href);
            if (!pending.has(current.pathname))
                continue;

            const next = link.cloneNode();
            const url = new URL(link.href);
            url.searchParams.set("x4", Date.now().toString());
            next.href = url.href;
            next.onload = () => link.remove();
            link.after(next);
            pending.delete(current.pathname);
        }

        if (pending.size === 0)
            return;
    }

    if (changed.length)
        location.reload();
});
