import { CODE_TO_INJECT } from "./injection";
import { graph } from "./graph";

const injectedHtml = `
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
`;

const DEFAULT_OPTIONS = "width=800, height=500";
const AUTO_LOAD_KEY = "_DEV_TOOLS_AUTO_LOAD_ENABLED_";
const AUTO_LOAD_OPTIONS_KEY = "_DEV_TOOLS_AUTO_LOAD_OPTIONS_";

let interval: any = null;
export function openWindow(options = DEFAULT_OPTIONS) {
  window.clearInterval(interval);
  const child = window.open(window.location.origin, "dev-tools", options);
  setTimeout(() => {
    (<any>child).commChannel.sendGraph(graph);
  });

  interval = setInterval(() => {
    if (!child || !(<any>child).commChannel) {
      return;
    }
    (<any>child).commChannel.ping();
  }, 200);

  if (!child) return;
  child.document.open();
  child.document.write(injectedHtml);
  child.document.close();
  return child;
}

export function appendIcon(
  callback: () => void = openWindow,
  buttonText = "Dev Tools",
  cssText = "position:fixed;right:10px;bottom:10px;z-index:100;"
) {
  var button = document.createElement("button");
  button.style.cssText = cssText;
  button.innerText = buttonText;
  button.onclick = callback;
  document.body.appendChild(button);
  return button;
}

function isAutoLoadOn() {
  const value = window.localStorage.getItem(AUTO_LOAD_KEY);
  return value === "true";
}

if (isAutoLoadOn()) {
  const options =
    window.localStorage.getItem(AUTO_LOAD_OPTIONS_KEY) || undefined;
  openWindow(options);
}

export function forceClearAutoload() {
  window.localStorage.setItem(AUTO_LOAD_KEY, "false");
}

export function autoReloadDevToolsUntilClosed(options = DEFAULT_OPTIONS) {
  if (typeof options !== "string") {
    throw Error("options must be a string");
  }
  window.localStorage.setItem(AUTO_LOAD_KEY, "true");
  window.localStorage.setItem(AUTO_LOAD_OPTIONS_KEY, options);
  return openWindow(options);
}
