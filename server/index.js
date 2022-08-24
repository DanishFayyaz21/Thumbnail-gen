
const cors = require("cors");
const fs = require("fs");
const resizeImg = require('resize-img');

const express = require("express");
const app = express();

const { createCanvas, loadImage } = require('canvas');


const bodyParser = require("body-parser");

// create express app
var router = express.Router({ strict: true });


function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = '';

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(lines + " " + word).width;
        // console.log(lines)
        if (width > maxWidth) {
            lines += "\n" + word;
        } else {
            lines = lines + " " + word;
        }
    }
    return lines.slice(1, 400);
}



// use cors
var corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);


app.get("/", (req, res) => {
    res.send("hi, there")

})


app.get("/thumbnail-gen", (req, res) => {

    const params = { header, title, description, photoUrl } = req.query;
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    const img = String(params.imageUrl)
    const isValidUrl = img => {
        try {
            return Boolean(new URL(img));
        }
        catch (e) {
            return false;
        }
    }
    if (isValidUrl && params.header && params.title && params.description && params.imageUrl) {


        // Write "header!"
        ctx.restore();
        ctx.clearRect()
        ctx.font = 'bold 55px inter'
        ctx.fillStyle = '#1463DF'
        if (getLines(ctx, params.header, 1100).length > 30) {
            ctx.fillText(getLines(ctx, String(params.header).slice(0, 30) + "...", 1050), 100, 222);

        }
        else {
            ctx.fillText(getLines(ctx, String(params.header).slice(0, 30), 1050), 100, 222);

        }
        ctx.restore();

        // Write "title!"
        ctx.clearRect()
        ctx.save();
        ctx.font = 'bold 96px inter'
        ctx.fillStyle = '#000'
        if (getLines(ctx, params.title, 1100).length > 45) {
            ctx.fillText(getLines(ctx, String(params.title).slice(0, 45) + "...", 1170), 100, 322);
        }
        else {
            ctx.fillText(getLines(ctx, String(params.title).slice(0, 45), 1170), 100, 322);

        }
        ctx.restore();


        // Write "description!"
        ctx.save();
        ctx.clearRect();
        ctx.font = '48px  inter'
        ctx.fillStyle = '#343A40'
        ctx.lineWidth = 15;
        ctx.rect(50, 50, 150, 180);
        if (getLines(ctx, params.description, 1100).length > 220) {
            ctx.fillText(getLines(ctx, params.description, 1100).slice(0, 220) + "...", 100, 600);
        } else {
            ctx.fillText(getLines(ctx, params.description, 1100).slice(0, 220), 100, 600);

        }
        ctx.restore();


        const vector = ("./Group 1.png")
        loadImage(vector).then((vectorImage) => {
            ctx.clearRect()
            ctx.drawImage(vectorImage, 1696, 800, 104, 150)
            ctx.restore();
        })


        ctx.fillStyle = '#1463DF';
        ctx.fillRect(0, 1037, 1920, 43);


        //================= Actuall image drawing==============//
        function roundedImage(x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        loadImage(img).then((image) => {
            ctx.clearRect()
            roundedImage(1300, 200, 550, 500, 50);
            ctx.clip();
            ctx.drawImage(image, 1300, 200, 550, 500)
            ctx.restore();
            resizeImg(canvas.toBuffer("image/png"), {
                width: 500,
            }).then((smallImage) => {
                res.end(smallImage)
            });


        }).catch(err => {
            res.status(400).send({ err: "image url is not valid. Please enter correct image url. and try again." })
        })



    } else {
        res.status(400).send({ message: "The following parameters are required: header, title, description, imageUrl" })
        console.log("error")
    }


})


// listen for requests
app.listen(5000, () => {
    console.log(`server is listening on port 5000`);
});
