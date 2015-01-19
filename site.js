$(document).ready(function() {

  /* Configure form settings */
  var config = {
    'height': {
      'regex': /h[0-9]+/,
      'min':4,
      'max':12
    },
    'width': {
      'regex': /w[0-9]+/,
      'min':4,
      'max':12
    }
  };

  /* Create form */
  var form = _.template($('.js-template').html());
  $('.js-configurable').on('click', function(ev) {

    $('.js-form').html(form({element: ev.currentTarget.id}));

    var bodyPart = ev.currentTarget;

    /* Event handlers */
    $('.js-height-up').on('click', function(ev) {
      changeClass(bodyPart, true, 'height');
      return false;
    });

    $('.js-height-down').on('click', function(ev) {
      changeClass(bodyPart, false, 'height');
      return false;
    });

  });


  /* Manipulate attributes */
  var getClassFromList = function(el, classRegex) {
    return el.className.match(classRegex)[0];
  };

  var getNumberFromClass = function(className) {
    var index = className.search(/[0-9]/);
    return parseInt(className.substr(index));
  };

  var changeClass = function(el, increment, attribute) {
    var currentClass = getClassFromList(el,config[attribute].regex);
    var currentNum = getNumberFromClass(currentClass);
    var newNum = currentNum + (increment ? 1 : -1);

    if (increment) {
      if (currentNum >= config[attribute].max) {
        newNum = config[attribute].min;
      }
    } else {
      if (currentNum <= config[attribute].min) {
        newNum = config[attribute].max;
      }
    }

    var newClass = 'h' + newNum;

    $(el).removeClass(currentClass).addClass(newClass);
  };

});