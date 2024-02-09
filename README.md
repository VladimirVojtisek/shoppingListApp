# Frontend homework #

To mock server API calls, this homework uses the [json-server](https://github.com/typicode/json-server) implementation.

## How to run this homework ##

1. Make sure you have json-server module installed for mock calls to be successfull.

```
npm install -g json-server
```

2. Then run the server on port 3001 watching the prepared database **db.json**:

```
json-server --watch db.json --port 3001
```

3. Then run the React app in another CLI window.

```
npm start
```