#!/usr/bin/env ruby
# This is a fucking awesome script to compile scripts. Remeber to run from the js dir.
#File Listing
filelist = Dir["./plugins/*.js"]
compiledscript = ""
filelist.each { |x|
	compiledscript += "/* " + x + " */\n\n" + IO.read(x) + "\n"
}

aFile = File.new("./plugins.js", "w")
if aFile
	aFile.syswrite(compiledscript)
else
	puts "ERROR!"
end