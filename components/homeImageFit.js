(function () {
  function fit() {
    var img = document.getElementById('home-img');
    var copy = document.getElementById('home-copy');
    if (!img || !copy) return;
    if (!img.complete || !img.naturalWidth) return;

    // Clear any previous constraint so we measure the image at its natural
    // (CSS-driven) size before comparing it against the text block.
    img.style.width = '';
    img.style.height = '';

    var naturalHeight = img.offsetHeight;
    var textHeight = copy.offsetHeight;

    if (naturalHeight > textHeight && textHeight > 0) {
      var ratio = img.offsetWidth / naturalHeight;
      img.style.height = textHeight + 'px';
      img.style.width = (textHeight * ratio) + 'px';
    }
  }

  function scheduleFit() {
    // Run twice on a frame apart: shrinking the image can change how the
    // paragraphs wrap, which can change textHeight, so we settle once more.
    fit();
    requestAnimationFrame(fit);
  }

  window.addEventListener('load', scheduleFit);
  window.addEventListener('resize', scheduleFit);

  var img = document.getElementById('home-img');
  if (img) {
    if (img.complete) {
      scheduleFit();
    } else {
      img.addEventListener('load', scheduleFit);
    }
  }

  document.addEventListener('DOMContentLoaded', scheduleFit);
})();
