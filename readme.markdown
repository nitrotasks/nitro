## Nitro

There is a bug in Nitro 1.4 for Chrome where it will not automatically load your data from 1.3.1

For now the manual fix is to follow these instructions:

`upgrade($.polyStorage.get('jStorage', 'empty'))`

![image](http://i.imgur.com/caxji.png)

**Important: This will delete any tasks you made AFTER updating to 1.4**

---

Licensed under the BSD License.

The easiest way to run the app is:

Chrome -> Extensions -> Developer Mode -> Load Unpacked Extension.
Choose the Nitro Folder.

George Czabania, 
Jono Cooper, 
http://caffeinatedco.de