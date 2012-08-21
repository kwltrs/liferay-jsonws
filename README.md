# Liferay Portal JSON WS bindings

```js
var config = {
  hostname: "localhost",
  port: 8080,
  auth: "user@example.com:secret"
};

var lportal = require('lportal').createServices( config );

var req = lportal.blogsEntry.getEntry({entryId: 1234});

req.on('data', function(entry) {
  console.log( entry.title );
});
```
