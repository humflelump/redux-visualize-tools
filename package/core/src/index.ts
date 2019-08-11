import { CODE_TO_INJECT } from "./injection";
import { Graph } from './vis/graph';
export default Graph;
export const graph = new Graph();

export function openWindow() {
    const child = window.open(window.location.origin, 'dev-tools', "width=800, height=500");
    setTimeout(() => {
       (<any>child).commChannel.sendGraph(graph);
    }, 1000);
    
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

