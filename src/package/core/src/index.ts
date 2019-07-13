import { CODE_TO_INJECT } from "./injection";


export function openWindow() {
    (<any>window).blah = "yeah"
    const child = window.open(window.location.origin, 'dev-tools', "width=500, height=500");
    if (!child) return; 
    child.document.open();
    child.document.write(`
    <html>
        <head>
            <script id="injected-react-code">
            ${CODE_TO_INJECT.code} 
            </script>
        </head>
        <body>
            <div id="root" />
        </body>
    </html>
    `)
    child.document.close();
}

