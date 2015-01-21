$(document).ready(function() {

  /* TODO
  1. Design a bunch of special parts (with special[1-9] + class toggle + psuedo elements)
  2. Let user save? URL parameters?
  3. Better form inputs.
  4. Shift + click for multi select?
  5. Browser support.
  */

  var formTemplate = _.template(document.getElementsByClassName('js-form-template')[0].innerHTML),
      fieldTemplate = _.template(document.getElementsByClassName('js-field-template')[0].innerHTML),
      formContainer = document.getElementsByClassName('js-form')[0],
      config = {
        'height': {
          'regex': /h[0-9\-]+/,
          'min':4,
          'max':12
        },
        'width': {
          'regex': /w[0-9\-]+/,
          'min':4,
          'max':12
        },
        'color': {
          'regex': /bg[0-9\-]+/,
          'min':1,
          'max':17
        },
        'radius': {
          'regex': /r[0-9]+/,
          'min':1,
          'max':4
        },
        'rotate': {
          'regex': /rotate[0-9\-]+/,
          'min':-4,
          'max':4
        },
        'vertical gap': {
          'regex': /margin[b|t][0-9\-]+/,
          'min':-4,
          'max':4
        },
        'horizontal gap': {
          'regex': /margin[l|r][0-9\-]+/,
          'min':-4,
          'max':4
        }
      };

  /* Event handlers */
  $('.js-configurable').mouseenter(function(ev) {
    $('i').removeClass('hover');
    $(ev.currentTarget).addClass('hover');
    ev.stopImmediatePropagation();
  });

  $('.js-configurable').mouseleave(function(ev) {
    $(ev.currentTarget).removeClass('hover');
    ev.stopImmediatePropagation();
  });

  $('.js-configurable').on('click', function(ev) {

    var prevForm = document.getElementsByClassName('js-fields')[0];
    if (prevForm) {
      removeForm(ev, prevForm);
    } else {
      makeForm(ev);
    }
    ev.stopImmediatePropagation();

  });

  /* Remove form */
  var removeForm = function(ev, prevForm) {

    var bodyPart = ev.currentTarget,
        isActive = bodyPart.classList.contains('active');

    prevForm.classList.remove('in');

    $('i').removeClass('active');

    window.setTimeout(function() {
      formContainer.innerHTML = '';
      if (!isActive) {
        makeForm(ev);
      }
    }, 200);

  };

  /* Create form */
  var makeForm = function(ev) {

    var bodyPart = ev.currentTarget;

    bodyPart.classList.add('active');

    formContainer.innerHTML = formTemplate({element: bodyPart.id});

    var form = document.getElementsByClassName('js-fields')[0];

    for (var key in config) {
      var classes = bodyPart.className;
      var match = classes.search(config[key].regex);
      if (match > -1) {
        form.innerHTML += fieldTemplate({ attribute: key });
      }
    };

    /* Form positioning */
    var topSpace = Math.floor(bodyPart.getBoundingClientRect().top);
    var rightSpace = Math.floor(bodyPart.getBoundingClientRect().right);
    var formWidth = Math.floor(form.offsetWidth);
    var isTop = topSpace < window.innerHeight / 2;
    var isRight = rightSpace < window.innerWidth / 2;

    if (isTop) form.classList.add('istop');
    if (isRight) form.classList.add('isright');

    $('.js-fields')
      .css('top',isTop ? topSpace : 'auto')
      .css('bottom',!isTop ? window.innerHeight - (topSpace + bodyPart.offsetHeight) : 'auto')
      .css('left', !isRight ? rightSpace + 40 : rightSpace - (formWidth + bodyPart.offsetWidth) - 40);

    window.requestAnimationFrame(function() {
      form.classList.add('in');
    });

    /* Event handlers */
    $('.js-input').on('click', function(ev) {
      var target = $(ev.currentTarget);
      var bodyPartName = document.getElementById(form.getAttribute('id').split('form-').pop());
      var attribute = target.parents('.js-field').attr('id').split('field-').pop();
      var increment = target.hasClass('js-up');
      changeClass(bodyPartName, attribute, increment);
      return false;
    });

    ev.stopImmediatePropagation();
  };

  /* Manipulate attributes */
  var getClassFromList = function(el, classRegex) {
    return el.className.match(classRegex)[0];
  };

  var getNumberFromClass = function(className) {
    var index = className.search(/[0-9\-]/);
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

    /* Exception for chest - this is ugly */
    if (el.id === 'chest' && attribute === 'width') {
      var bodyContainer = document.getElementById('body-container');
      bodyContainer.classList.remove(currentClass);
      bodyContainer.classList.add(newClass);
    };

    return false;
  };

});