var fs = require('fs');
var reformatter = require('./reformat');

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    var outputText = reformatter.reformatText(data, parseInt(process.argv[3]), process.argv[4] == 'true', process.argv[5] == 'true');
    console.log(outputText);
});

