// ===========================  USER INPUTS  =========================== //

let artistName = "glass beams"
let date = "12.08.2025"
let time = "20:30"
let venue = "fuchs2"
let city = "prague | czech republic"
let songFile = "gb.mp3"
let artistImageFile = "gb.jpg"
let duration

// ===================================================================== //

let sound; 
let fft;

let canvas;

let shapePoints = []
let shapeDone = false;
let fftDone = false;
let count = 0
let txtStart = 235
let txtGap = 225
let txtX = 20

let firstXpos = 400
let secondXpos = firstXpos+750 
let yDelay = 200

let photo; 
let maskImage; 
let font; 
let final

let upperBounds = 450
let startX;
let startY;
let startAngle;

let dateX;
let dateY;
let timeX;
let timeY;
let dateTilt;

let lengthRay = 1.8

let gradientPos = 0
let gradient;
let gradients = [
  [
    { stop: 0, color: [29,150,115] },  
    { stop: 1, color: [207,250,181] }, 
  ],
  [
    { stop: 0.0, color: [145,7,7] },  
    { stop: 0.34, color: [228,48,48] }, 
    { stop: 1.0, color: [254,178,178] } 
  ],
  [
    { stop: 0, color: [55,31,31] },  
    { stop: 0.29, color: [191,45,45] }, 
    { stop: 0.68, color: [255,225,142] }, 
    { stop: 1, color: [255,246,236] }, 
  ],
  [
    { stop: 0.0, color: [65,61,100] },  
    { stop: 0.6, color: [77,112,158] }, 
    { stop: 1.0, color: [250,255,233] } 
  ],
  [
    { stop: 0, color: [28,29,39] } ,
    { stop: 0.42, color: [44,50,94] }, 
    { stop: 1, color: [195,168, 240] },  
  ],
  [
    { stop: 0, color: [53,54,58] },  
    { stop: 0.21, color: [104,84,187] }, 
    { stop: 0.75, color: [207,128,182] }, 
    { stop: 1, color: [196,193,206] },
  ],
  [
    { stop: 0.1, color: [65,71,70] },  
    { stop: 0.29, color: [147,71,63] }, 
    { stop: 0.62, color: [56,142,145] }, 
    { stop: 0.87, color: [164,149,131] }, 
  ],
  [
    { stop: 0, color: [264,89,35] },  
    { stop: 1, color: [207,224,32] }, 
  ],
  [
    { stop: 0, color: [151,72,129] },  
    { stop: 1, color: [174,231,231] }, 
  ],
  [
    { stop: 0, color: [60,73,56] },  
    { stop: 1, color: [255,149,72] }, 
  ],
  [
    { stop: 0, color: [82,13,18] },  
    { stop: 1, color: [136,249,253] }, 
  ],
  [
    { stop: 0, color: [42,58,73] },  
    { stop: 0.5, color: [70,135,95] }, 
    { stop: 1, color: [255,230,21] }, 
  ],
  [
    { stop: 0, color: [139,18,49] },  
    { stop: 1, color: [104,255,150] }, 
  ],
  [
    { stop: 0, color: [0,0,0] },  
    { stop: 1, color: [255,255,255] }, 
  ],
  [
    { stop: 0, color: [82,44,44] },  
    { stop: 0.29, color: [66,126,98] }, 
    { stop: 1, color: [250,185,45] }, 
  ],
  [
    { stop: 0, color: [151,72,129] },  
    { stop: 1, color: [207,250,181] }, 
  ],
]

let button, nextButton, inputSound, inputPhoto, buttonReset, saveButton
let artistInput, dateInput, timeInput, venueInput, cityInput, durationInput, jumpInput
let songLabel, photoLabel, jumpValue, sizeValue, sizeInput, headline, photoFileName, soundFileName
let photoLabelWrapper, songlabelWrapper
let resetPos=true


function preload() {
  font = loadFont('dl.otf');
  sound = loadSound(songFile);
  photo = loadImage(artistImageFile);
}

function setup() {

  canvas = createCanvas(1240, 1748);
  canvas.position(windowWidth/2+350,25+yDelay)
  // canvas.style('border', '16px solid white');
  canvas.style('border-radius', '10px'); // Optional for rounded corners
  canvas.style('box-shadow', '0 0 1000px rgba(0, 0, 0, 0.3)'); 
  angleMode(DEGREES)
  fft = new p5.FFT(0.8, 256);
  gradient = gradients[gradientPos];
  artistName = randomCapitalize(artistName)
  venue = randomCapitalize(venue)
  city = randomCapitalize(city)
  startAngle = random(360)

  fill(0)
  textFont(font)
  rectMode(CORNER)
  colorMode(HSB)

  decidePositions()

  button = createButton('Generate');
  styleButtonInput(button, firstXpos, 500+yDelay);
  button.mousePressed(genPos);

  nextButton = createButton('Next');
  styleButtonInput(nextButton, firstXpos, 500+yDelay);
  nextButton.mousePressed(genNext);
  nextButton.style('display', 'none');

  headline = createElement('h1', 'hArmOnIq')
  headline.style('font-size', '200px');
  headline.style('font-family', 'myFirstFont');
  headline.style('color', 'white');
  headline.style('border', '0px solid white')
  headline.style('stroke', 'none')
  headline.position(firstXpos, -100+yDelay);

  
  songLabel = createElement('p', 'Song: glass-beams.mp3');
  songLabel.style('font-size', '50px');
  songLabel.style('font-family', 'Arial');
  songLabel.position(firstXpos, 1110+yDelay);

  songlabelWrapper = createElement('label', 'Upload song');
  songlabelWrapper.attribute('for', 'soundup');
  styleButtonInput(songlabelWrapper, firstXpos, 950+yDelay);

  inputSound = createFileInput(handleSound);
  inputSound.position(firstXpos, 950+yDelay);
  inputSound.id('soundup')
  inputSound.style('display', 'none');


 // photoLabel = createElement('p', 'Photo: glass-beams.png');
 // photoLabel.style('font-size', '50px');
//  photoLabel.style('font-family', 'Arial');
 // photoLabel.position(firstXpos, 1050+yDelay);

  photoLabel = createInput('Photo: glass-beams.mp3')
  photoLabel.style( 'font-size', '75px');
  photoLabel.attribute('placeholder', text)
  photoLabel.style('border-radius', '20px');
  photoLabel.style('padding', '0px 40px');
  photoLabel.style('border', '0px solid white');
  photoLabel.size(700, 130)
  
  photoLabelWrapper = createElement('label', 'Upload photo');
  photoLabelWrapper.attribute('for', 'photoup');
  styleButtonInput(photoLabelWrapper, firstXpos, 800+yDelay);

  inputPhoto = createFileInput(handleImage);
  inputPhoto.position(firstXpos, 700+yDelay);
  inputPhoto.style('display', 'none');
  inputPhoto.id('photoup')
  setupTextInputs()
  
  saveButton = createButton('Save');
  styleButtonInput(saveButton, firstXpos, 1400+yDelay);
  saveButton.mousePressed(saveAction);

  buttonReset = createButton('Reset generation');
  styleButtonInput(buttonReset, firstXpos, 650+yDelay);
  buttonReset.mousePressed(restartGeneration);
  
}

function setupTextInputs() {
  artistInput = createInput('glass beams');
  styleTextInput(artistInput, secondXpos, 500+yDelay, 'Artist name', artistName)

  venueInput = createInput('Melodka');
  styleTextInput(venueInput, secondXpos, 650+yDelay, 'Venue name', venue)

  dateInput = createInput('12.08.2025');
  styleTextInput(dateInput, secondXpos, 800+yDelay, 'Date (DD.MM.YYYY)', date)

  timeInput = createInput('22:30');
  styleTextInput(timeInput, secondXpos, 950+yDelay, 'Time (HH:MM)', time)

  cityInput = createInput('Brno | Czech Republic');
  styleTextInput(cityInput, secondXpos, 1100+yDelay, 'City | Country', city)

  durationInput = createInput();
  styleTextInput(durationInput, secondXpos, 1250+yDelay, 'Duration (sec, default=10)', duration)

  jumpInput = createInput();
  styleTextInput(jumpInput, secondXpos, 1400+yDelay, 'Jump to (sec, default=0)', jumpValue)

  sizeInput = createInput();
  styleTextInput(sizeInput, secondXpos, 1550+yDelay, 'Ray length (0-3, default=2)', sizeValue)
}

function styleTextInput(input, xpos, ypos, text, value) {
  input.size(900, 130);
  input.position(xpos, ypos);
  input.style( 'font-size', '75px');
  input.attribute('placeholder', text)
  input.style('border-radius', '20px');
  input.style('padding', '0px 40px');
  input.style('border', '0px solid white');
}

function styleButtonInput(b, xpos, ypos) {
  b.position(xpos, ypos);
  // Style the button
  b.style('font-size', '75px');
  b.style('padding', '20px 0px'); // Standard Material button padding
  b.style('background-color', 'grey'); // Material primary color
  b.style('color', '#ffffff'); // Text color
  b.style('font-family', 'Roboto, sans-serif'); // Material font
  b.style('border', 'none'); // No border
  b.style('border-radius', '20px'); // Rounded corners
  b.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Material shadow
  b.style('cursor', 'pointer'); // Pointer cursor for clickable elements
  b.style('transition', 'background-color 0.3s, box-shadow 0.3s'); // Smooth animations\
  b.style('width', '700px');
  b.style('text-align', 'center');

  // Hover effect
  b.mouseOver(() => {
    b.style('background-color', 'darkgrey'); // Darker shade on hover
    b.style('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.3)'); // Deeper shadow on hover
  });

  // Reset hover effect
  b.mouseOut(() => {
    b.style('background-color', 'grey'); // Original color
    b.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Original shadow
  });

  // Active (clicked) effect
  b.mousePressed(() => {
    b.style('background-color', '#383838'); // Accent color on press
  });

}

function restartGeneration() {
  
  if (!fftDone) {
    if (sound.isPlaying()) {
      sound.pause();
      noLoop();
    } 
  }
  background(255, 100)
  fft = new p5.FFT(0.8, 256);
  gradient = gradients[gradientPos];
  artistName = randomCapitalize(artistName)
  venue = randomCapitalize(venue)
  city = randomCapitalize(city)
  startAngle = random(360)
  fftDone = false;
  count = 0;  
  if (!fftDone) {
     photoLabel.style('color', 'lightgrey')
  } else {
     let col = gradient[0].color
     photoLabel.style('color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`)
  }
  
  songLabel.style('color', 'lightgrey')
  loop();
  setup()
  nextButton.style('display', 'none');
  button.style('display', 'block');
  sendGray()
  headline.style('color', `white`);

  artistInput.value(artistName.toLowerCase())
  venueInput.value(venue.toLowerCase())
  cityInput.value(city.toLowerCase())
  dateInput.value(date)
  timeInput.value(time)
  if (duration != 600) {
    durationInput.value(duration/60)
  }
  if (jumpValue != 0) {
    jumpInput.value(jumpValue)
  }
  if (lengthRay !=1.8) {
    sizeInput.value(lengthRay)
  }
  if (soundFileName != undefined) {
    let a = "Song: " + soundFileName
    if (a.length > 25) a = a.substring(0, 25) + "...";
    songLabel.html(a);
  }
  if (photoFileName != undefined) { 
    let a = "Photo: " + photoFileName
    if (a.length > 25) a = a.substring(0, 25) + "...";
    photoLabel.html(a);
  } 
  
  
  
}

function handleSound(file) {
  if (file.type === 'audio') {
    soundFileName = file.name;
    sound = loadSound(file.data, '');
    let a = "Song: " + soundFileName
    if (a.length > 25) a = a.substring(0, 25) + "...";
    songLabel.html(a);
    
  } 
}

function handleImage(file) {
  if (file.type === 'image') {
    photoFileName = file.name;
    photo = loadImage(file.data, '');
    let a = "Photo: " + photoFileName
    if (a.length > 25) a = a.substring(0, 25) + "...";
//    photoLabel.html(a);
    photoLabel.value = a
    
  } 
}

function draw() {
  background(255, 0);
  makeMaskObject();

  if (fftDone) {
    background(0, 0, 100, 100);

    let mimg = new Image();
    mimg.src = maskImage;
    imgOnLoad(mimg);
  }
}

function imgOnLoad(mimg) {
  mimg.onload = () => {
    let maskImg = createImage(width, height);
    maskImg.drawingContext.drawImage(mimg, 0, 0);

    mimg = photo.get();
    mimg.mask(maskImg);

    image(mimg, 0, 0);

    makeHeadline(false);
    drawDate(dateX, dateY);
    drawTime(timeX, timeY);
    drawLocation();

    applyGradientMap();

    applyGrainEffect(100);
    sendColorToPage(gradient[gradient.length-1].color);
    let col = gradient[0].color
    headline.style('color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
    changeButtonColors(col);
    noLoop();
  };
}

function changeButtonColors(col) {
  nextButton.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
  nextButton.mouseOut(() => {
    nextButton.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`); // Original color
    nextButton.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Original shadow
  });

  buttonReset.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
  buttonReset.mouseOut(() => {
    buttonReset.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`); // Original color
    buttonReset.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Original shadow
  });

  photoLabelWrapper.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
  photoLabelWrapper.mouseOut(() => {
    photoLabelWrapper.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`); // Original color
    photoLabelWrapper.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Original shadow
  });

  songlabelWrapper.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
  songlabelWrapper.mouseOut(() => {
    songlabelWrapper.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`); // Original color
    songlabelWrapper.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Original shadow
  });

  saveButton.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`);
  saveButton.mouseOut(() => {
    saveButton.style('background-color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`); // Original color
    saveButton.style('box-shadow', '0px 2px 4px rgba(0, 0, 0, 0.2)'); // Original shadow
  });

}

function randomCapitalize(str) {
  str = str.toLowerCase();
  let result = "";
  for (let char of str) {
    if (random(1) < 0.2) {
      result += char.toUpperCase();
    } else {
      result += char.toLowerCase();
    }
  }
  return result;
}

function applyGrainEffect(grainIntensity = 30) {
  let grainImg = createGrainImage(grainIntensity);
  push();
  blendMode(SOFT_LIGHT); 
  image(grainImg, 0, 0, width, height);
  pop();
}

function applyGradientMap() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;

      let r = pixels[index];
      let g = pixels[index + 1];
      let b = pixels[index + 2];

      let brightness = rgbToBrightnessHSB(r, g, b);

      let gradientColor = interpolateGradient(brightness / 100, gradient);

      pixels[index] = gradientColor[0];
      pixels[index + 1] = gradientColor[1];
      pixels[index + 2] = gradientColor[2];
    }
  }

  updatePixels();
}

function rgbToBrightnessHSB(r, g, b) {
  colorMode(HSB, 255);
  let hsbColor = color(r, g, b);
  return brightness(hsbColor); 
}

function interpolateGradient(value, gradient) {
  for (let i = 0; i < gradient.length - 1; i++) {
    let start = gradient[i];
    let end = gradient[i + 1];

    if (value >= start.stop && value <= end.stop) {
      let t = map(value, start.stop, end.stop, 0, 1);
      return [
        lerp(start.color[0], end.color[0], t), 
        lerp(start.color[1], end.color[1], t), 
        lerp(start.color[2], end.color[2], t)  
      ];
    }
  }

  return value < gradient[0].stop
    ? gradient[0].color
    : gradient[gradient.length - 1].color;
}

function decidePositions() {
  if(resetPos) {
    startX = random(300, width-200)
    startY = random(upperBounds+50, height-150)
  }
  dateX = random(200, width-200)
  dateY = random(upperBounds, height-150)

  timeX = random(200, width-200)
  timeY = random(upperBounds, height-150)
  while(createVector(dateX, dateY).dist(createVector(timeX, timeY)) < 300) {
    timeX = random(200, width-200)
    timeY = random(upperBounds, height-150)
  }

  dateTilt = random(-30, 30)
}

function createGrainImage(n = 30) {
  let pd = pixelDensity()
  let gg = createImage(width * pd, height * pd)
  gg.loadPixels()
  let p = gg.pixels
  for (let i = 0; i < p.length; i += 4) {
    let v = 127 + round(random(-n / 5, n / 5))
    p[i] = v
    p[i + 1] = v
    p[i + 2] = v
    p[i + 3] = 255
  }
  gg.updatePixels()
  return gg
}

function makeMaskObject() {
  push()
  if (!fftDone) {
    translate(startX, startY)
    let array = fft.analyze()
    let dist = map(array.reduce((a, b) => a + b) / array.length, 0, 130, 100, 750)*lengthRay; 
    let step = dist/169
    let angleStep = 360 / duration;
    for (let i = 0; i < subset(array, 0, 170).length; i++) {
      let angle = count * angleStep+startAngle; 
      let x = cos(angle) * (i*step); 
      let y = sin(angle) *  (i*step); 
      circle(x, y, map(array[i], 0, 255, 0, 10)); 
    }


    if (sound.isPlaying()) {
      count++
    }
    if (count == duration+5) {
      sound.pause()
      fftDone = true;
      count = 0
      maskImage = canvas.elt.toDataURL();
      nextButton.style('display', 'block');
    }
  }
  pop()
}

function makeHeadline(textOnRight, headlineBackground) {
  if (headlineBackground) {
    fill(0,0,100)
    rect(0,0, width, upperBounds)
  }
  let x = txtX
  if (textOnRight) { 
    x = width - txtX
  }
  fill(0,0,0)
  textSize(300)
  let txt = artistName
  let overflow = []
  let tbox = font.textBounds(txt, 50, 250)
  while (tbox.w+75 > width) {
    overflow.push(txt.charAt(txt.length-1))
    txt = txt.slice(0, -1)
    tbox = font.textBounds(txt, 50, 250)
  }

  if (txt.charAt(txt.length-1) != " " && overflow[overflow.length-1] != " ") {
    txt += "-"
  }
  text(txt, x, txtStart)
  overflow = reverse(overflow)
  txt = overflow.join("")
  txt = txt.trim()

  tbox = font.textBounds(txt, x, 250)
  if (tbox.w+200 > width) {
    overflow = []
    while (tbox.w+200 > width) {
      overflow.push(txt.charAt(txt.length-1))
      txt = txt.slice(0, -1)
      tbox = font.textBounds(txt, x, 250)
    }
  
    if (txt.charAt(txt.length-1) != " " && overflow[overflow.length-1] != " ") {
      txt += "-"
    }
    text(txt, x, txtStart + txtGap)
    overflow = reverse(overflow)
    text(overflow.join(''), x, txtStart + txtGap*2)
  } else {
    txt = overflow.join('')
    txt = txt.trim()
    text(txt, x, txtStart + txtGap)
  }

}

function drawDate(x, y) {
  push()
  translate(x, y)
  rotate(dateTilt)
  strokeWeight(8)
  stroke(0,0,0)
  textSize(100)
  textAlign(CENTER)
  ellipseMode(CENTER)
  fill(255)
  ellipse(0,0-33, font.textBounds(date, x, y).w+200, 175)
  fill(0)
  noStroke()
  text(date, 0,0)
  pop()
}

function drawTime(x, y) {
  push()
  stroke(0,0,0)
  translate(x, y)
  rotate(-dateTilt)
  strokeWeight(8)
  textSize(100)
  textAlign(CENTER)
  ellipseMode(CENTER)
  fill(255)
  ellipse(0,0-33, font.textBounds(time, x, y).w+200, 175)
  fill(0)
  noStroke()
  text(time, 0,0)
  pop()
}

function drawLocation(inverse) {
  push()
  noStroke()
  if (inverse) {
    fill(0,0,100)
  } else {
    fill(0,0,0)
  }
  rectMode(CORNER)
  rect(0, height-110, width, 110)
  textSize(50)
  rectMode(CENTER)
  textAlign(CENTER)
  if (inverse) {
    fill(0,0,0)
  } else {
    fill(0,0,100)
  }
  text(venue, width/2, height-50)
  textSize(20)
  text(city, width/2, height-20)
  pop()
}

function genPos() {
  artistName = randomCapitalize(artistInput.value())
  venue = randomCapitalize(venueInput.value())
  city = randomCapitalize(cityInput.value())
  date = dateInput.value()
  time = timeInput.value()
  duration = int(durationInput.value())*60
  jumpValue = jumpInput.value()

  duration = durationInput.value() == "" ? 600 : int(durationInput.value())*60
  jumpValue = jumpInput.value() == "" ? 0 : jumpInput.value()
  lengthRay = sizeInput.value() == "" ? 1.8 : sizeInput.value()

  button.style('display', 'none');
  nextButton.style('display', 'none');
  

     let col = gradient[0].color
     photoLabel.style('color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`)

  if (!fftDone) {
    if (sound.isPlaying()) {
      
      sound.pause();
      noLoop();

    } else {
      sound.loop();
      sound.jump(int(jumpValue))
      loop();
    }
  } 
  
}

function genNext() {
  if (fftDone)  {
    loop()
    background(255, 100);
    increaseGradientPos()
    gradient = gradients[gradientPos];
    decidePositions()
    artistName = randomCapitalize(artistInput.value())
    venue = randomCapitalize(venueInput.value())
    city = randomCapitalize(cityInput.value())
    date = dateInput.value()
    time = timeInput.value()  
    duration = durationInput.value() == "" ? 600 : int(durationInput.value())*60
    jumpValue = jumpInput.value() == "" ? 0 : jumpInput.value()
    lengthRay = sizeInput.value() == "" ? 1.8 : sizeInput.value()
    sendColorToPage(gradient[gradient.length-1].color);
  //  if (!fftDone) {
//     photoLabel.style('color', 'lightgrey')
//  } else {
//     let col = gradient[0].color
//     photoLabel.style('color', `rgb(${col[0]}, ${col[1]}, ${col[2]})`)
//    }
  }
  
}

function sendColorToPage(col) {
  const colorString = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
  window.parent.postMessage({ type: 'updateColor', color: colorString }, '*');
}

function sendGray() {
  window.parent.postMessage({ type: 'updateColor', color: 'lightgrey' }, '*');
}

function increaseGradientPos() {
  gradientPos ++
  if (gradientPos == gradients.length) {
    gradientPos = 0
  }
}

function saveAction() {
    save(artistName.toLowerCase() + "_" + venue.toLowerCase() + "_" + date + "_poster.png");
}

function mouseClicked(event) {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
  resetPos = false
  restartGeneration()
  startX = mouseX
  startY = mouseY
  resetPos = true
  }
}
