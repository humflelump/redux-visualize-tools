cd graph-render-web-worker
yarn build
cd ..
cd injected-code
yarn build
cd ..
cd core
cd create-injector-file
node index.js
cd ..
yarn build