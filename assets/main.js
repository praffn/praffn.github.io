//////////////////////
// Perspective Card //
//////////////////////
(function(win, doc) {
  var PERSPECTIVE_CARD = '[data-js-perspective-card]';
  var PERSPECTIVE_CARD_CONTAINER = '[data-js-perspective-card-container]';
  var PERSPECTIVE_CARD_TEXT = '[data-js-perspective-card-text]';
  
  var PERSPECTIVE_CARD_ENTER_EXIT_CLASS = 'perspective-card-enter-exit';

  var PERSPECTIVE_ROTATION = 7;
  var PERSPECTIVE_TRANSLATION = 3;
  var PERSPECTIVE_PERSPECTIVE = 800;
  
  function init() {
    // call perspectiveCard on all perspective card elements
    Array.prototype.forEach.call(doc.querySelectorAll(PERSPECTIVE_CARD), perspectiveCard);
  }

  function perspectiveCard(card) {
    console.log('card');
    var boundingBox = card.getBoundingClientRect();
    var cardContainer = card.querySelector(PERSPECTIVE_CARD_CONTAINER);
    var cardText = card.querySelector(PERSPECTIVE_CARD_TEXT);
    // attach mouse move event listener to card
    card.addEventListener('mousemove', function(evt) {
      onMouseMove(evt.clientX, evt.clientY, card, boundingBox, cardContainer, cardText)
    });
    card.addEventListener('mouseenter', function() {
      onMouseEnter(card);
    });
    card.addEventListener('mouseleave', function() {
      onMouseLeave(card);
    });
  }

  function onMouseEnter(card) {
    var cardContainer = card.querySelector(PERSPECTIVE_CARD_CONTAINER);
    card.classList.add(PERSPECTIVE_CARD_ENTER_EXIT_CLASS);    
  } 

  function onMouseMove(clientX, clientY, card, boundingBox, cardContainer, cardText) {
    // get top,left,width,height from bounding box
    var boundingBox = card.getBoundingClientRect();
    var top = boundingBox.top;
    var left = boundingBox.left;
    var width = boundingBox.width;
    var height = boundingBox.height;

    // x and y are mouse position within card
    var x = clientX - left;
    var y = clientY - top;
    // px and py are positional percentage (0-1, where 0 is top/left and 1 is bottom/right)
    var px = (x-width/2)/width*2;
    var py = (y-height/2)/height*2;
    // we want to rotate along the perpindicular axis.
    // for example when we are all the way to the right we want
    // to multiply rotation by 1, and all the way to the left with -1
    var rotateY = px * PERSPECTIVE_ROTATION;
    var rotateX = py * PERSPECTIVE_ROTATION;
    // translation is for the text
    var translateX = px * PERSPECTIVE_TRANSLATION;
    var translateY = py * PERSPECTIVE_TRANSLATION;

    window.requestAnimationFrame(function() {
      cardContainer.style.transition = '';
      cardContainer.style.transform = 'perspective('+PERSPECTIVE_PERSPECTIVE+'px) rotateY('+rotateY+'deg) rotateX('+rotateX+'deg)';
      cardText.style.transition = '';
      cardText.style.transform = 'translate('+translateX+'px, '+translateY+'px)';
      window.requestAnimationFrame(function() {
        card.classList.remove(PERSPECTIVE_CARD_ENTER_EXIT_CLASS);
      });
    });
  }

  function onMouseLeave(card) {
    var cardContainer = card.querySelector(PERSPECTIVE_CARD_CONTAINER);
    var cardText = card.querySelector(PERSPECTIVE_CARD_TEXT);
    window.requestAnimationFrame(function () {
      card.classList.add(PERSPECTIVE_CARD_ENTER_EXIT_CLASS);
      cardContainer.style.transform = '';
      cardText.style.transform = '';
      window.requestAnimationFrame(function() {
        card.classList.remove(PERSPECTIVE_CARD_ENTER_EXIT_CLASS);        
      })
    });
  }

  init();

})(window, document);

//////////////////////
// Scroll Showcase  //
//////////////////////
(function(win, doc) {

  var el = doc.querySelector('[js-autoscroll]');

  var running = true;  
  var changedEasing = false;
  var values = { scrollTop: 0 };
  var tween = new TWEEN.Tween(values)
    .to({ scrollTop: 50 }, 1000)
    .easing(function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t })
    .onUpdate(function(v) {
      el.scrollTop = values.scrollTop;
    })
    .onStop(function() {
      running = false;
    })
    .repeat(1)
    .yoyo(1)
    .start();

  function scroll(time) {
    if (running) {
      requestAnimationFrame(scroll);
    }
    TWEEN.update(time);
  }
  requestAnimationFrame(scroll);
})(window, document);