# allows

Express middleware to help you manage the allowed HTTP verbs.

Basic usage:
```javascript
var app = express();
app.use(allows('GET', 'PUT', 'POST'));
app.get('/', function(req, res) {
	return res.status(200).send({ hello: 'world' });
});
```
