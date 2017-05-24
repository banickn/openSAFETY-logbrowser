require "rubygems"
require "json"

new_json = []
# Read JSON from a file, iterate over objects
file = open("errorcodes.json")
json = file.read

parsed = JSON.parse(json)

parsed.each do |list|
    #p list[1]["desc"]
    line = {:id => list[0], :desc => list[1]["desc"]}
    new_json << line

end

File.open("output.json","w") do |f|
  f.write(new_json.to_json)
end