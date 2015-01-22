
  /* TODO
  1. Better form inputs.
  // List form types need serious cleanup / simplification
       - Non-color forms should be list as well, row of blocks with active highlighted
       - Move all buttons into template
  1a. Dismiss form when user clicks off
  2. Don't need regexes, can just use string matches
  3. Design a bunch of special parts (with special[1-9] + class toggle + psuedo elements)
  4. Let user save? URL parameters?
  5. Browser support.
  */

  var formTemplate = _.template(document.getElementsByClassName('js-form-template')[0].innerHTML),
      fieldTemplate = _.template(document.getElementsByClassName('js-field-template')[0].innerHTML),
      formContainer = document.getElementsByClassName('js-form')[0],
      config = {
        'height': {
          'regex': /h[0-9\-]+/,
          'min':4,
          'max':12,
          'form': 'increment'
        },
        'width': {
          'regex': /w[0-9\-]+/,
          'min':4,
          'max':12,
          'form': 'increment'
        },
        'color': {
          'regex': /bg[0-9\-]+/,
          'min':1,
          'max':17,
          'form': 'list'
        },
        'radius': {
          'regex': /r[0-9]+/,
          'min':1,
          'max':4,
          'form': 'increment'
        },
        'rotate': {
          'regex': /rotate[0-9\-]+/,
          'min':-4,
          'max':4,
          'form': 'increment'
        },
        'vertical gap': {
          'regex': /margin[b|t][0-9\-]+/,
          'min':-4,
          'max':4,
          'form': 'increment'
        },
        'horizontal gap': {
          'regex': /margin[l|r][0-9\-]+/,
          'min':-4,
          'max':4,
          'form': 'increment'
        }
      };

  var configurable = document.getElementsByClassName('js-configurable');

  /* Event handlers */
  for (var i = 0; i < configurable.length; i++) {

    configurable[i].addEventListener('click', function(ev) {
      var prevForm = document.getElementsByClassName('js-fields')[0];
      if (prevForm) {
        removeForm(ev.currentTarget, prevForm);
      } else {
        makeForm(ev.currentTarget);
      }
      ev.stopImmediatePropagation();
    });

  }

  /* Remove form */
  var removeForm = function(bodyPart, prevForm) {

    var isActive = bodyPart.classList.contains('active');

    prevForm.classList.remove('in');

    for (var i = 0; i < configurable.length; i++) {
      configurable[i].classList.remove('active');
    }

    window.setTimeout(function() {
      formContainer.innerHTML = '';
      if (!isActive) {
        makeForm(bodyPart);
      }
    }, 200);

  };

  /* Create form */
  var makeForm = function(bodyPart) {

    bodyPart.classList.add('active');

    formContainer.innerHTML = formTemplate({element: bodyPart.id});

    var form = document.getElementsByClassName('js-fields')[0];

    // Create form fields
    for (var key in config) {
      var classes = bodyPart.className;
      var match = classes.search(config[key].regex);
      if (match > -1) {
        form.innerHTML += fieldTemplate({ attribute: key });
      }

      if (config[key].form === 'list') {
        var field = document.getElementById('field-' + key);
        var count = config[key].max - config[key].min;

        for (var i = 0;i <= count;i++ ) {
          var buttonTemplate = "<a href='#' data-attribute='" + key + "' data-num='" + i + "' class='bg" + i + " button button-list js-list js-input'></a>";
          field.innerHTML += buttonTemplate;
        };
      }

      /* Event handlers for our new inputs */
      var inputs = document.getElementsByClassName('js-input');
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('click', function(ev, key) {
          var target = ev.currentTarget;
          var increment = target.classList.contains('js-up') ? 1 : -1;
          var newNum = target.classList.contains('js-list') ? target.dataset.num : null;
          var attribute = target.dataset.attribute;

          changeClass(bodyPart, attribute, increment, newNum);
          ev.stopImmediatePropagation();
        });
      }
    };

    /* Form positioning */
    var topSpace = Math.floor(bodyPart.getBoundingClientRect().top);
    var rightSpace = Math.floor(bodyPart.getBoundingClientRect().right);
    var formWidth = Math.floor(form.offsetWidth);
    var isTop = topSpace < window.innerHeight / 2;
    var isRight = rightSpace < window.innerWidth / 2;

    window.requestAnimationFrame(function() {
      form.classList.add('in');
      if (isTop) form.classList.add('istop');
      if (isRight) form.classList.add('isright');
    });

    form.style.top = isTop ? topSpace + 'px' : 'auto';
    form.style.bottom = !isTop ? window.innerHeight - (topSpace + bodyPart.offsetHeight) + 'px' : 'auto';
    form.style.left = !isRight ? rightSpace + 40 + 'px' : rightSpace - (formWidth + bodyPart.offsetWidth) - 40  + 'px';

  };

  /* Manipulate attributes */
  var getClassFromEl = function(el, classRegex) {
    return el.className.match(classRegex)[0];
  };

  var getNumberFromClass = function(className) {
    var index = className.search(/[0-9\-]/);
    return parseInt(className.substr(index));
  };

  var changeClass = function(el, attribute, increment, newNum) {
    var currentClass = getClassFromEl(el,config[attribute].regex);
    var currentNum = getNumberFromClass(currentClass);
    var newNum = newNum || currentNum + increment;

    if (increment === 1 && currentNum >= config[attribute].max) {
      newNum = config[attribute].min;
    }

    if (increment === -1 && currentNum <= config[attribute].min) {
      newNum = config[attribute].max;
    }

    console.log(newNum);

    var newClass = currentClass.replace(currentNum,newNum);

    el.classList.remove(currentClass);
    el.classList.add(newClass);

    /* Match leg heights to each other */
    var bodyPartName = el.id;

    if (bodyPartName.indexOf('leg') > -1 && attribute === 'height') {
      var pair = 'leg-' +
        (bodyPartName.indexOf('lower') > -1 ? 'lower-' : 'upper-') +
        (bodyPartName.indexOf('left') > -1 ? 'right' : 'left');
      document.getElementById(pair).classList.remove(currentClass);
      document.getElementById(pair).classList.add(newClass);
    };

    /* Exception for chest - this is ugly */
    if (bodyPartName === 'chest' && attribute === ('width' || 'vertical gap')) {
      var bodyContainer = document.getElementById('body-container');
      bodyContainer.classList.remove(currentClass);
      bodyContainer.classList.add(newClass);
    };

    return false;
  };
