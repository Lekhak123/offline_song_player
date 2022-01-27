const fs = require('fs');
const {directory} = require("./config.json")

function appendObject(obj){
    var configFile = fs.readFileSync('./songs.json');
 
  if(!(configFile.includes(obj))){
    var config = JSON.parse(configFile);
    config.push(obj);
    var configJSON = JSON.stringify(config);
    fs.writeFileSync('./songs.json', configJSON);
  }


  }
  
 
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }




const find_song = async() => {
    fs.readdirSync(directory).forEach(file => {
        appendObject(file);
        });
        var songs_file = JSON.parse(fs.readFileSync('./songs.json'));
    let index = randomInteger(0,songs_file.length - 1);
    return songs_file[index];
}
find_song()
module.exports = {
    find_song
};