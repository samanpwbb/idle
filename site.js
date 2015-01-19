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
  $('.js-form').html(form());

  var pelvis = document.getElementById('pelvis');

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

    if (currentNum >= config[attribute].max) {
      newNum = config[attribute].min;
    }

    var newClass = 'h' + newNum;

    $(el).removeClass(currentClass).addClass(newClass);
  };

  $('.js-height-up').on('click', function(ev) {
    changeClass(pelvis, true, 'height');
    return false;
  });

  $('.js-height-down').on('click', function(ev) {
    changeClass(pelvis, false, 'height');
    return false;
  });

});