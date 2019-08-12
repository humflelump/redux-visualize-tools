import { CODE_TO_INJECT } from "./injection";
import { Graph } from "./vis/graph";
export default Graph;
export const graph = new Graph();

export function openWindow(options = "width=800, height=500") {
  const child = window.open(window.location.origin, "dev-tools", options);
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
    `);
  child.document.close();
}

export function appendIcon(
  callback: () => any = openWindow,
  buttonText = "Dev Tools",
  cssText = "position:fixed;right:10px;bottom:10px;z-index:100;"
) {
  var button = document.createElement("button");
  button.style.cssText = cssText;
  button.innerText = buttonText;
  button.onclick = callback;
  document.body.appendChild(button);
}
