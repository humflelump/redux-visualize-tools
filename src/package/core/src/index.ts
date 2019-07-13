import { CODE_TO_INJECT } from "./injection";


export function openWindow() {
    (<any>window).blah = "yeah"
    const child = window.open(window.location.origin);
    if (!child) return; 
    child.document.open();
    child.document.write(`
    <html>
        <script>
            ${CODE_TO_INJECT}
        </script>
        <body>
            wow omg huh
        </body>
    </html>
    `)
    child.document.close();
}

