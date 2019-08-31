import lcs from "node-lcs";

const removeInvisibleChars = str => {
  return str
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
};

function analyze(strings, searchText) {
  searchText = removeInvisibleChars(searchText);
  return strings.map(string => {
    string = removeInvisibleChars(string);
    return lcs(string, searchText);
  });
}

self.onmessage = function(e) {
  const { strings, searchText } = e.data;
  let t = Date.now();
  const result = analyze(strings, searchText);
  console.log("search took", Date.now() - t);
  self.postMessage(result);
};
