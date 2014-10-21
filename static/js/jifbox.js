(function() {

  var streaming = false,
      video        = document.querySelector('#vdo'),
      canvas       = document.querySelector('#cnvs'),
      photo        = document.querySelector('#photo'),
      startbutton  = document.querySelector('button#snap'),
      width = 320,
      height = 0,
      count = -1,
      burst = true,
      start;

  gif = new GIF({
    workers: 2,
    quality: 10,
    width: 320,
    height: 240,
    workerScript: '/static/gif.js/dist/gif.worker.js'
  });

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    {
      video: true,
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
  );

  video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  function takepicture(){
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/png');
    

    count++;
    if (count === 12) {
      document.querySelector('#jif').src = '/static/gif.js/site/contents/images/loading.gif'
      start = new Date
      gif.render();
      
    } else if (burst) {
      snapPhoto();
    }

    count = count % 12;

    document.querySelector('.photo' + count).setAttribute('src', data);
    gif.addFrame(document.querySelector('.photo' + count), {delay: 200});
  }

  function snapPhoto(){
    if (count < 12){
      setTimeout(takepicture, 500);
    }
  }

  gif.on('finished', function(blob) {
    document.querySelector('#jif').src = URL.createObjectURL(blob);
    total = new Date - start
    console.log('Took ' + total + ' miliseconds to run')
  });

  startbutton.addEventListener('click', function(ev){
    console.log(burst)
    burst == true ? snapPhoto() : takepicture();
    ev.preventDefault();
  }, false);

})();