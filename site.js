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
    },
    'color': {
      'regex': /bg-[0-9]+/,
      'min':1,
      'max':17
    }
  };

  /* Create form */
  var form = _.template($('.js-form-template').html());
  var field = _.template($('.js-field-template').html());

  $('.js-configurable').mouseenter(function(ev) {
      $('i').removeClass('hover');
      $(ev.currentTarget).addClass('hover');
  });

  $('.js-configurable').mouseleave(function(ev) {
      $(ev.currentTarget).removeClass('hover');
  });

  $('.js-configurable').on('click', function(ev) {

    if ($(ev.currentTarget).hasClass('active')) {
      $(ev.currentTarget).removeClass('active');
      $('.js-form').html('');
    } else {

      $('i').removeClass('active');
      $(ev.currentTarget).addClass('active');
      $('.js-form').html(form({element: ev.currentTarget.id}));

      var bodyPart = ev.currentTarget;

      for (var key in config) {
        var classList = ev.currentTarget.className;
        var match = classList.search(config[key].regex);
        if (match > -1) {
          $('.js-fields').append(field({ attribute: key}));
        }
      };

      /* Event handlers */
      $('.js-input').on('click', function(ev) {
        var target = $(ev.currentTarget);
        var bodyPart = document.getElementById($('.js-fields').attr('id').split('form-').pop());
        var attribute = target.parents('.js-field').attr('id').split('field-').pop();
        var increment = target.hasClass('js-up');
        changeClass(bodyPart, attribute, increment);
        return false;
      });
    }

  });

  /* Manipulate attributes */
  var getClassFromList = function(el, classRegex) {
    return el.className.match(classRegex)[0];
  };

  var getNumberFromClass = function(className) {
    var index = className.search(/[0-9]/);
    return parseInt(className.substr(index));
  };

  var changeClass = function(el, attribute, increment) {
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

    var newClass = currentClass.replace(currentNum,newNum);

    $(el).removeClass(currentClass).addClass(newClass);
  };

});