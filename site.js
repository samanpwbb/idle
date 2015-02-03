/* TODO
1. Design a bunch of special parts (with special[1-x] + class toggle + psuedo elements)
2. Let user save? Keep track of all data in URL? (this will be interesting / hard)
3. More interesting form elements, direct select up/down/left/right
4. Browser support.
*/

var background = document.getElementsByClassName('js-background')[0],
    form = document.getElementsByClassName('js-form')[0],
    fields = document.getElementsByClassName('js-fields'),
    buttons = document.getElementsByClassName('js-input');
    configurable = document.getElementsByClassName('js-configurable'),
    config = {
      'special': {
        'min':0,
        'max':2,
        'form': 'names',
        'names': {
          'eyes': [
            'none',
            'cyclops',
            'eyes'
          ],
          'head': [
            'none',
            'ears',
            'antennae'
          ],
          'leg-lower-right': [
            'none',
            'foot',
            'details'
          ],
          'leg-lower-left': [
            'none',
            'foot',
            'details'
          ],
          'arm-upper-left': [
            'none',
            'details',
            'wings'
          ],
          'arm-upper-right': [
            'none',
            'details',
            'wings'
          ]
        }
      },
      'background': {
        'min':0,
        'max':17,
        'form': 'list'
      },
      'height': {
        'min':4,
        'max':12,
        'form': 'increment'
      },
      'width': {
        'min':4,
        'max':12,
        'form': 'increment'
      },
      'radius': {
        'min':1,
        'max':4,
        'form': 'increment'
      },
      'vertical gap': {
        'min':-4,
        'max':4,
        'form': 'increment'
      },
      'horizontal gap': {
        'min':-4,
        'max':4,
        'form': 'increment'
      }
  };

  /* Event handlers */
  var timer = null;
  window.onresize = function() {
    if (timer != null) clearTimeout(timer);

    timer = setTimeout(function() {
      var activePart = document.getElementsByClassName('js-configurable active')[0] || false;
      handleInput(activePart, true);
    }, 100);
  };

  background.addEventListener('click', function(ev) {
    if (ev.target === ev.currentTarget) {
      handleInput(ev.currentTarget);
    }
  });

  for (var i = 0;i < configurable.length; i++) {
    configurable[i].addEventListener('mouseover', function(ev) {
      for (var i = 0; i < configurable.length; i++) {
        configurable[i].classList.remove('hover');
      }
      ev.currentTarget.classList.add('hover');
      ev.stopPropagation();
    });

    configurable[i].addEventListener('mouseleave', function(ev) {
      ev.currentTarget.classList.remove('hover');
      ev.stopPropagation();
    });

    configurable[i].addEventListener('click', function(ev) {
      handleInput(ev.currentTarget);
      ev.stopImmediatePropagation();
    });

  }

  var handleInput = function(target, refresh) {
    var isActive = target ? target.classList.contains('active') : false;
    var isBodyPart = target.classList.contains('js-configurable');

    for (var i = 0; i < configurable.length; i++) {
      configurable[i].classList.remove('active');
    }

    form.innerHTML = '';

    if (!isActive && isBodyPart || refresh && isBodyPart) {
      makeForm(target);
    } else {
      form.style.bottom = null;
      form.style.left = null;
    }

  };

  var makeForm = function(bodyPart) {
    bodyPart.classList.add('active');

    var fields = document.createElement('DIV');
      fields.id = 'form-' + bodyPart.id;
      fields.className = 'js-fields fields in animate-opacity';

    // Create form fields
    for (var key in config) {
      var match = bodyPart.className.search(config[key].regex);
      var count = (config[key].max - config[key].min) + 1;

      var field = document.createElement('DIV');
        field.id = 'field-' + key;
        field.className = 'cf field js-field';

      var label = document.createElement('DIV');
        label.className = 'block label';

      // Only labels for increments
      if (config[key].form === 'increment') {
        var labelText = document.createTextNode(key);
        label.appendChild(labelText);
      }

      field.appendChild(label);

      if (match > -1) {
        fields.appendChild(field);

        // Create buttons
        for (var i = 0; i < count;i++ ) {
          var button = document.createElement('A');
            button.setAttribute('href','#');
            button.dataset.attribute = key;
            button.dataset.num = config[key].min + i;
            button.className = 'attr-' + key + i + ' button-' + config[key].form + ' button js-list js-input';
            if (config[key].form === 'names') {
              var nameList = config[key].names[bodyPart.id];
              var buttonName = document.createTextNode(nameList[i]);
              button.appendChild(buttonName);
            }
          setActiveClass(button, bodyPart);

          field.appendChild(button);
        }
      }
    }

    form.appendChild(fields);

    /* Event handlers for our new buttons */
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function(ev) {
        var target = ev.currentTarget;
        var attribute = target.dataset.attribute;
        var newClass = currentClass.replace(currentNum,target.dataset.num);
        // this is broken
        setBodyPartClass(bodyPart, attribute, newClass);
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

    form.style.bottom = !isTop ? window.innerHeight - (topSpace + partHeight) - 40 + 'px' : window.innerHeight - (formHeight + topSpace) + 40 + 'px';
    form.style.left = !isRight ? rightSpace + 40 + 'px' : rightSpace - (formWidth + partHeight) - 20  + 'px';

  }

  /* Manipulate attributes */
  var getClassFromEl = function(el, attributeName) {
    var regex = new RegExp(attributeName + '[0-9\-]');
    for (var i = 0; i < el.classList.length; i++) {
      if (el.classList[i].match(regex)) {
        return el.classList[i];
      }
    }
  };

  var getNumberFromClass = function(className) {
    var index = className.search(/[0-9\-]/);
    return parseInt(className.substr(index));
  };

  var setActiveClass = function(button, bodyPart) {
    var attribute = button.dataset.attribute,
      currentClass = getClassFromEl(bodyPart, config[attribute].regex);

    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].classList.contains('active') && buttons[i].dataset.attribute === attribute) {
        buttons[i].classList.remove('active');
      }
    }

    if (parseInt(button.dataset.num) === getNumberFromClass(currentClass)) {
      button.classList.add('active');
    }

  };

  /* this needs to be reworked to only take bodyPart and newClass arguments,
  target should adapt based on changes to data model */
  var setBodyPartClass = function(el, attribute, newClass) {
    var currentClass = getClassFromEl(el,attribute),
      currentNum = getNumberFromClass(currentClass),

    el.classList.remove(currentClass);
    el.classList.add(newClass);

    /* this needs to be changed to be based on data model */
    setActiveClass(target, el);

    /* Match leg heights to each other */
    var bodyPartName = el.id;
    if (bodyPartName.indexOf('leg') > -1) {
      var pair = 'leg-' +
        (bodyPartName.indexOf('lower') > -1 ? 'lower-' : 'upper-') +
        (bodyPartName.indexOf('left') > -1 ? 'right' : 'left');
      document.getElementById(pair).classList.remove(currentClass);
      document.getElementById(pair).classList.add(newClass);
    };

    if (bodyPartName.indexOf('arm') > -1) {
      var pair = 'arm-' +
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

  /* Data model */
  var storedBody = {};
  var getDataFromClasses = function() {

    for (var i = 0; i < configurable.length; i++) {

      var el = configurable[i];

      /* Grab each body part, add as keys */
      storedBody[el.id] = [];

      /* Grab all modifiable classnames and add them to corresponding keys */
      for (var key in config) {
        var match = configurable[i].className.search(key);
        if (match > -1) {
          var part = getClassFromEl(el, key);
          storedBody[configurable[i].id].push(part);
        }
      }
      /*
      Now we should have a data object that can be passed into setBodyPartClass
      We will need to:
        1. Click handlers update this object
        2. After click, updated object is passed to render function
      */
    }
  };

  getDataFromClasses();

  var addClassesfromData = function() {
    for (key in storedBody) {
      for (i in storedBody[key]) {
        var bodyPart = document.getElementById(key);
        setBodyPartClass(bodyPart, storedBody[key][i]);
      }
    }
  };
