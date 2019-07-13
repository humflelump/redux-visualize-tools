import { code } from "./injection";

export function openWindow() {
    (<any>window).blah = "yeah"
    const child = window.open(window.location.origin);
    if (child) {
        console.log({child});
        child.document.open();
        child.document.write(`
        <html>
            <script>
                ${code}
            </script>
            <body>
            wow im so smart
            </body>
        </html>
        `)
        child.document.close();
    }
}

