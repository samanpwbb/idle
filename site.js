/* TODO
1a. Dismiss form when user clicks off
2. Highlight active settings
3. Design a bunch of special parts (with special[1-9] + class toggle + psuedo elements)
4. Let user save? URL parameters?
5. Browser support.
*/

var form = document.getElementsByClassName('js-form')[0],
    fields = document.getElementsByClassName('js-fields');
    configurable = document.getElementsByClassName('js-configurable'),
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

  /* Event handlers */
  for (var i = 0;i < configurable.length; i++) {

    configurable[i].addEventListener('click', function(ev) {

      if (fields) {
        removeForm(ev.currentTarget, fields);
      } else {
        makeForm(ev.currentTarget);
      }
      ev.stopImmediatePropagation();
    });

  }

  var addClick = function(ev) {
  }

  /* Remove form */
  var removeForm = function(bodyPart) {
    var isActive = bodyPart.classList.contains('active');

    for (var i = 0; i < fields.length; i++) {
      fields[i].classList.remove('in');
    }

    for (var i = 0; i < configurable.length; i++) {
      configurable[i].classList.remove('active');
    }

    window.setTimeout(function() {
      form.innerHTML = '';
      form.classList.remove('isright');
      if (!isActive) {
        makeForm(bodyPart);
      }
    }, 200);

  };

  /* Create form */
  var makeForm = function(bodyPart) {

    bodyPart.classList.add('active');

    var fields = document.createElement('DIV');
      fields.id = 'form-' + bodyPart.id;
      fields.className = 'js-fields fields in animate1';

    // Create form fields
    for (var key in config) {
      var match = bodyPart.className.search(config[key].regex);
      var count = config[key].max - config[key].min;

      var field = document.createElement('DIV');
        field.id = 'field-' + key;
        field.className = 'cf field js-field';

      var label = document.createElement('DIV');
        label.className = 'block label';

      var labelText = document.createTextNode(key);
        label.appendChild(labelText);

      field.appendChild(label);

      if (match > -1) {
        fields.appendChild(field);

        var currentClass = getClassFromEl(bodyPart, config[key].regex);

        // Create buttons
        for (var i = 0; i < count;i++ ) {
          var button = document.createElement('A');
            button.setAttribute('href','#');
            button.dataset.attribute = key;
            button.dataset.num = config[key].min + i;
            button.className = 'attr-' + key + i + ' button-' + config[key].form + ' button button-list js-list js-input';

            if (parseInt(button.dataset.num) === getNumberFromClass(currentClass)) {
              button.classList.add('active');
            }
          field.appendChild(button);
        }
      }
    }

    form.appendChild(fields);

    /* Event handlers for our new buttons */
    var buttons = document.getElementsByClassName('js-input');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function(ev) {
        var target = ev.currentTarget;
        var attribute = target.dataset.attribute;
        var newNum = target.dataset.num;
        changeClass(bodyPart, attribute, newNum);
        ev.stopImmediatePropagation();
      });
    }

    /* Form positioning */
    var topSpace = Math.floor(bodyPart.getBoundingClientRect().top);
    var rightSpace = Math.floor(bodyPart.getBoundingClientRect().right);
    var formHeight = Math.floor(form.offsetHeight);
    var partHeight = Math.floor(bodyPart.offsetHeight);
    var formWidth = Math.floor(form.offsetWidth);
    var isTop = topSpace < window.innerHeight / 2;
    var isRight = rightSpace < window.innerWidth / 2;

    window.requestAnimationFrame(function() {
      if (isRight) form.classList.add('isright');
    });

    form.style.bottom = !isTop ? window.innerHeight - (topSpace + partHeight) - 40 + 'px' : window.innerHeight - (formHeight + topSpace) + 40 + 'px';
    form.style.left = !isRight ? rightSpace + 40 + 'px' : rightSpace - (formWidth + partHeight) - 20  + 'px';

  }

  /* Manipulate attributes */
  var getClassFromEl = function(el, classRegex) {
    return el.className.match(classRegex)[0];
  };

  var getNumberFromClass = function(className) {
    var index = className.search(/[0-9\-]/);
    return parseInt(className.substr(index));
  };

  var changeClass = function(el, attribute, newNum) {

    var currentClass = getClassFromEl(el,config[attribute].regex);
    var currentNum = getNumberFromClass(currentClass);
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
