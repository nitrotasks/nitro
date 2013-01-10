coffee -o handlebars -c *.coffee
handlebars handlebars/task.js -f task.js
handlebars handlebars/list.js -f list.js
rm -r handlebars
