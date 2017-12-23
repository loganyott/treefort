//Random Quotes on Front Page
var imgCount = 5;
var dir = 'wp-content/uploads/2017/08/';
var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
var images = new Array
images[1] = "quote_1.png",
    images[2] = "quote_2.png",
    images[3] = "quote_3.png",
    images[4] = "quote_4.png",
    images[5] = "quote_5.png",
    images[6] = "quote_6.png",
    images[7] = "quote_7.png",
    images[8] = "quote_8.png",
    document.getElementById("randomQuote").style.backgroundImage = "url(" + dir + images[randomCount] + ")";