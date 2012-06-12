#!/usr/bin/env ruby

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