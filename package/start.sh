cd injected-code
yarn build &
cd ..
cd core
cd create-injector-file
node index.js &
cd ..
cd core
yarn build
cd ..
cd graph-render-web-worker
yarn start


