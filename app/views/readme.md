# Views #

Views are written in CoffeeScript and then pre-compiled using Handlebars.

Simple script to compile them.
Requires the npm modules `coffee` and `handlebars`.



```
coffee -o handlebars -c *.coffee
handlebars handlebars/task.js -f task.js
handlebars handlebars/list.js -f list.js
rm -r handlebars
```
