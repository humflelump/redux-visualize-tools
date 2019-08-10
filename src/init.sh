cd test-app
yarn install
cd ..
cd package
cd core
yarn install
cd injected-code-dist
yarn link
cd ..
cd ..
cd injected-code
yarn install
cd ..
cd ..
cd test-app
yarn link "redux-visualize-tools"
