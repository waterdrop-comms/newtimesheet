var fs = require('fs');
//npm install syntax-error
var syntaxcheck = require('syntax-error');

// path to your js folder, loop through current only.
//var pathtocheck = __dirname +  '/home/simon/nodejsws/timesheet/client/app/login/'
var pathtocheck = '/home/simon/nodejsws/timesheet/client/app/register/'

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

var filelist = getFiles(pathtocheck)
if (typeof filelist !== 'undefined' && filelist.length > 0) {
    filelist.forEach(file => {
      if (file.endsWith(".js")) {
       var src = fs.readFileSync(file);
       var err = syntaxcheck(src, file);
       if (err) {
          console.error('Please fix on below point' + Array(55).join('-'));
          console.error(err);
          console.error(Array(80).join('-'));
       }       
     }
    }); 
} 
else 
{ 
   console.log('no files.');
}

