//(function() {
// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;
var imgReady = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video = null;
var canvas = null;
var photo = null;
var capturebutton = null;
var photobutton = null;
var txtOutput = null;
var ocrBtn = null;

var crop = null;

function startup() {
	video = document.getElementById('video');
	canvas = document.getElementById('canvas');
	photo = document.getElementById('photo');
	capturebutton = document.getElementById('capBtn');
	photobutton = document.getElementById('photoBtn');
	txtOutput = document.getElementById('txtOutput');
	ocrBtn = document.getElementById('ocrBtn');

	enhaBtn.addEventListener('click', function (ev) {
		enhaphoto.src = photo.src;
		goScreen("enhance");
		ev.preventDefault();
	}, false);
	finalBtn.addEventListener('click', function (ev) {
		finalphoto.src = enhaphoto.src;
		goScreen("ocr");
		ev.preventDefault();
	}, false);

	photobutton.addEventListener('click', function (ev) {
		video.addEventListener('canplay', handlePhoto, false);
		takepicture();
		ev.preventDefault();
	}, false);

	// Set event listeners for the start and stop buttons
	capturebutton.addEventListener("click", function (ev) {
		video.addEventListener('canplay', handleCapture, false);
		startCapture();
		ev.preventDefault();
	}, false);

	ocrBtn.addEventListener("click", function (ev) {
		upy();
		ev.preventDefault();
	}, false);

	crophoto.addEventListener('load', (e) => {
		console.log("new crop");
		if (crop)
			crop.destroy();
		crop = new Cropper(crophoto, {
			aspectRatio: 16 / 9,
			crop(event) {
				/*
			console.log(event.detail.x);
			console.log(event.detail.y);
			console.log(event.detail.width);
			console.log(event.detail.height);
			console.log(event.detail.rotate);
			console.log(event.detail.scaleX);
			console.log(event.detail.scaleY); */
			},
		});
	})

	clearcanvas();

	goScreen("captures");
}

function adaptSizes() {
	let pwidth = photo.clientWidth;
	console.log(width);
	height = video.videoHeight;
	width = video.videoWidth;

	pheight = video.videoHeight / (video.videoWidth / width);
	if (isNaN(pheight)) {
		console.log("h NaN");
		pheight = pwidth / (4 / 3);
	}

	video.setAttribute('width', width);
	video.setAttribute('height', height);
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
}

function video2canvas() {
	var context = canvas.getContext('2d');

	context.filter = "saturate(0%)"; //"grayscale(100%)";

	//canvas.width = width;
	//canvas.height = height;
	context.drawImage(video, 0, 0, width, height);

	var data = canvas.toDataURL('image/png');
	photo.className = "w-100 border";
	photo.setAttribute('src', data);

	let tracks = video.srcObject.getTracks();
	tracks.forEach(track => track.stop());
	video.srcObject = null;
}

function handlePhoto(ev) {
	console.log('canplay photo');

	adaptSizes();

	if (!streaming) {

		streaming = true;

		if (width && height) {
			video2canvas();

			streaming = false;
			video.removeEventListener('canplay', handlePhoto, false);
		} else {
			clearcanvas();
		}
	}
}

// Fill the photo with an indication that none has been
// captured.

function clearcanvas() {
	var context = canvas.getContext('2d');
	context.fillStyle = "#AAA";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var data = canvas.toDataURL('image/png');
	photo.setAttribute('src', data);
	enhaphoto.setAttribute('src', data);
	finalphoto.setAttribute('src', data);
}

async function startCapture() {
	//logElem.innerHTML = "";

	navigator.mediaDevices.getDisplayMedia({
			video: {
				cursor: "always"
			},
			audio: false
		})
		.then(function (stream) {
			video.srcObject = stream;
			video.play();
		})
		.catch(function (err) {
			console.log("An error occurred: " + err);
		});

	console.log("cap");

	//video.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
	//dumpOptionsInfo();
}

function handleCapture(evt) {
	console.log('canplay capture');

	adaptSizes();

	if (!streaming) {

		streaming = true;

		if (width && height) {
			/*
			let track = video.srcObject.getTracks()[0];

			imageCapture = new ImageCapture(track);
			imageCapture.grabFrame()
				.then(imageBitmap => { */
			/*
			drawCanvas(canvas, imageBitmap);
			
			var data = canvas.toDataURL('image/png');
			photo.className = "w-100 border";
			photo.setAttribute('src', data);
			
			
			let tracks = video.srcObject.getTracks();
			tracks.forEach(track => track.stop());
			video.srcObject = null; */

			video2canvas();

			streaming = false;
			video.removeEventListener('canplay', handleCapture, false);
			//).catch(error => console.log(error));
		} else {
			clearcanvas();
		}

		//------------------------------
		/*
		streaming = true;
        //let can = document.createElement("canvas")
        //can.className = "miniTela";

        let track = video.srcObject.getTracks()[0];

        imageCapture = new ImageCapture(track);
        imageCapture.grabFrame()
            .then(imageBitmap => {
                //const canvas = document.getElementById("myCanvas");
                //telasElem.appendChild(can);
                drawCanvas(canvas, imageBitmap);
				
				var data = canvas.toDataURL('image/png');
				photo.className = "w-100 border";
				photo.setAttribute('src', data);
				
				
				let tracks = video.srcObject.getTracks();
				tracks.forEach(track => track.stop());
				video.srcObject = null; 

				streaming = false;
				video.removeEventListener('canplay', handleCapture, false);
            })
            .catch(error => console.log(error)); */

	}
}
/*
    function drawCanvas(canvas, img) {
        canvas.width = getComputedStyle(canvas).width.split('px')[0];
        //canvas.height = getComputedStyle(canvas).height.split('px')[0];
		// TODO cavas is width 0
        console.log(canvas.width);
        //console.log(canvas.height);
        //let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
        let ratio = canvas.width / img.width;
        canvas.height = img.height * ratio;
        //let x = (canvas.width - img.width * ratio) / 2;
        //let y = (canvas.height - img.height * ratio) / 2;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
            0, 0, img.width * ratio, img.height * ratio);
        //canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
        //    x, y, img.width * ratio, img.height * ratio);
    }

    function dumpOptionsInfo() {
        const videoTrack = video.srcObject.getVideoTracks()[0];

        console.info("Track settings:");
        console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
        console.info("Track constraints:");
        console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    } */

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takepicture() {
	navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false
		})
		.then(function (stream) {
			video.srcObject = stream;
			video.play();
		})
		.catch(function (err) {
			console.log("An error occurred: " + err);
		});

	console.log("pic");


}

function goScreen(scrName) {
	var main = document.getElementsByTagName("main")[0];
	var divs = main.children;
	divs = [...divs];
	console.log(divs);
	divs.forEach((d) => d.style.display = "none");
	var scr = document.getElementById(scrName);
	scr.style.display = "block";
}

// Set up our event listener to run the startup process
// once loading is complete.
window.addEventListener('load', startup, false);

// Tesseract
var language = 'eng'

//import Tesseract from 'tesseract.js';

var worker = new Tesseract.createWorker({
	logger: progressUpdate,
});

function progressUpdate(packet) {
	console.log(packet);
	/*
	var log = document.getElementById('log');

	var line = document.createElement('div');

	line.appendChild(document.createTextNode(packet.status))

	if('progress' in packet){
		if(packet.progress == 1)
			line.appendChild(document.createTextNode(" complete"))
	}

	if(packet.status == 'done'){
		var pre = document.createElement('pre')
		pre.appendChild(document.createTextNode(packet.data.text))
		line.innerHTML = ''
		line.appendChild(pre)
	}

	log.insertBefore(line, log.firstChild) */
}

function result(res) {
	console.log('result was:', res)

	progressUpdate({
		status: 'done',
		data: res
	})
	/*
		res.words.forEach(function(w){
			var b = w.bbox;

			ioctx.strokeWidth = 2

			ioctx.strokeStyle = 'red'
			ioctx.strokeRect(b.x0, b.y0, b.x1-b.x0, b.y1-b.y0)
			ioctx.beginPath()
			ioctx.moveTo(w.baseline.x0, w.baseline.y0)
			ioctx.lineTo(w.baseline.x1, w.baseline.y1)
			ioctx.strokeStyle = 'green'
			ioctx.stroke()
		}) */
}
/*
document.body.addEventListener('drop', async function(e){
	e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0]
	var reader = new FileReader();
	reader.onload = function(e){
		input.src = e.target.result;
		input.onload = function(){

			setUp();

		}
	};
	reader.readAsDataURL(file);
  await worker.load();
  await worker.loadLanguage(language);
  await worker.initialize(language);
  const { data } = await worker.recognize(file);
  result(data);
}) */

// input == img
async function upy(e) {
	/*
	console.log(myfile.files[0]);
    var file = 	myfile.files[0];
	var reader = new FileReader();
	reader.onload = function(e){
		input.src = e.target.result;
		input.onload = function(){

			setUp();

		}
	};
	reader.readAsDataURL(file); */
	await worker.load();
	await worker.loadLanguage(language);
	await worker.initialize(language);
	const {
		data
	} = await worker.recognize(photo.src);
	result(data);
}




/*
var croping = false;
var dragging = false;

enhaphoto.addEventListener('mousedown', (e) => {dragging = true;e.preventDefault();})
enhaphoto.addEventListener('mouseup', (e) => {dragging = false;})
enhaphoto.addEventListener('mouseleave', (e) => {dragging = false;})
enhaphoto.addEventListener('touchend', (e) => {dragging = false;})
enhaphoto.addEventListener('mousemove', (e) => {if(dragging) console.log(e.pageX,e.pageY);})

enhaphoto.addEventListener('mouseleave', (e) => console.log('mouseleave'))
enhaphoto.addEventListener('touchend', (e) => console.log('touchend'))
enhaphoto.addEventListener('mousedown', (e) => console.log('mousedown'))
enhaphoto.addEventListener('mouseup', (e) => console.log('mouseup'))
enhaphoto.addEventListener('keydown', (e) => console.log('keydown'))
//enhaphoto.addEventListener('mousemove', (e) => console.log('mousemove'))
enhaphoto.addEventListener('touchmove', (e) => console.log('touchmove'))
*/

//})();