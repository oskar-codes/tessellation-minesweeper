
# Build the project
npm run compile

# If directory dist exists, remove it
if [ -d "dist" ]; then
    rm -rf dist
fi

# Create directory dist
mkdir dist

# Create directoy dist/build
mkdir dist/build

# Copy index.html to dist
cp index.html dist/index.html

# Copy ./resources to dist
cp -r ./resources dist/resources

# Copy ./build/* to dist/build
cp -r ./build/* dist/build