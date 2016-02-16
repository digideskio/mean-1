var lwip = require('lwip'),
    fs = require('fs'),
    sourceDirectory = '../public/images/mugs/',
    destinationDirectory = '../public/images/test-destination/';

console.log(process.cwd());

fs.readdir(sourceDirectory, function (err, files) {
    if (err) console.log(err);
    console.log(files);

    files.forEach(function(file) {
        scaleImage(file);
    });

})

function scaleImage (file) {

    lwip.open(sourceDirectory + file, function(err, image) {
        if (err) console.log (err);
        if(image) {
            var width = 400,
                height = 500,
                imageHeight = image.height(),
                imageWidth = image.width(),
                ratio;

            ratio = Math.max(width / imageWidth, height / imageHeight);

            image.batch()
                .scale(ratio)
                .crop(400, 500)
                .writeFile(destinationDirectory + file, function(err) {
                    if (err) console.log (err);
                    console.log(file + ": has been processed");
                });
        } else {
            console.log('could\'t find no stinking image');
        }
    });
}

