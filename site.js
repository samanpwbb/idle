/* TODO
1. Let user save? Keep track of all data in URL? (this will be interesting / hard)
2. Highlight limb matches
3. just save numbers for values, not classnames
4. More interesting form elements, direct select up/down/left/right
5. Scrap class-based styling altogether
6. Browser support.
*/

var background = document.getElementsByClassName('js-background')[0],
  form = document.getElementsByClassName('js-form')[0],
  buttons = document.getElementsByClassName('js-input');
  configurable = document.getElementsByClassName('js-configurable'),
  storedBody = {},
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
    'marginy': {
      'min':-4,
      'max':4,
      'form': 'increment'
    },
    'marginx': {
      'min':-4,
      'max':4,
      'form': 'increment'
    }
  };

/* UI Basics */
var timer = null;
window.onresize = function() {
  if (timer != null) clearTimeout(timer);

  timer = setTimeout(function() {
    var activePart = document.getElementsByClassName('js-configurable active')[0] || false;
    positionForm(activePart);
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

var handleInput = function(target) {
  var isActive = target ? target.classList.contains('active') : false;
  var isBodyPart = target.classList.contains('js-configurable');

  for (var i = 0; i < configurable.length; i++) {
    configurable[i].classList.remove('active');
  }

  form.innerHTML = '';

  if (!isActive && isBodyPart) {
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
    var match = bodyPart.className.search(key);
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
          button.dataset.newClass = key + (config[key].min + i);
          button.className = 'attr-' + key + i + ' button-' + config[key].form + ' button js-list js-input';

          if (config[key].form === 'names') {
            var nameList = config[key].names[bodyPart.id];
            var buttonName = document.createTextNode(nameList[i]);
            button.appendChild(buttonName);
          }

        field.appendChild(button);
      }
    }
  }

  form.appendChild(fields);
  setActiveButtons(bodyPart.id,storedBody);

  /* Event handlers for our new buttons */
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(ev) {
      var target = ev.currentTarget;

      updateData(bodyPart, target.dataset.attribute, target.dataset.newClass);
      ev.stopImmediatePropagation();
    });
  }

  positionForm(bodyPart);

};

/* Form positioning */
var positionForm = function(el) {
  if (!el) return false;
  var topSpace = Math.floor(el.getBoundingClientRect().top);
  var rightSpace = Math.floor(el.getBoundingClientRect().right);
  var formHeight = Math.floor(form.offsetHeight);
  var partHeight = Math.floor(el.offsetHeight);
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

var updateData = function(el, attribute, newClass) {
  var activePart = el.id;


  /* Update data */
  storedBody[el.id][attribute] = newClass;

  /* Update body based on data */
  setBodyPart(activePart, storedBody);

  /* Update form based on data */
  setActiveButtons(activePart, storedBody);

};


var setActiveButtons = function(activePart, data) {

  // iterate through buttons + iterate through data looking for matches
  for (var i = 0; i < buttons.length; i++) {
    var attribute = buttons[i].dataset.attribute;
    if (data[activePart][attribute] === buttons[i].dataset.newClass) {
      buttons[i].classList.add('active');
    } else if (buttons[i].classList.contains('active')) {
      buttons[i].classList.remove('active');
    }
  }

};

var setBodyPart = function(activePart, data) {

  var el = document.getElementById(activePart);

  for (attribute in data[activePart]) {
    var currentClass = getClassFromEl(el,attribute);
    var newClass = data[activePart][attribute];

    el.classList.remove(currentClass);
    el.classList.add(newClass);

    /* Match leg heights to each other */
    if (activePart.indexOf('leg') > -1) {
      var pair = 'leg-' +
        (activePart.indexOf('lower') > -1 ? 'lower-' : 'upper-') +
        (activePart.indexOf('left') > -1 ? 'right' : 'left');
      document.getElementById(pair).classList.remove(currentClass);
      document.getElementById(pair).classList.add(newClass);
    };

    /* Match arm heights to each other */
    if (activePart.indexOf('arm') > -1) {
      var pair = 'arm-' +
        (activePart.indexOf('lower') > -1 ? 'lower-' : 'upper-') +
        (activePart.indexOf('left') > -1 ? 'right' : 'left');
      document.getElementById(pair).classList.remove(currentClass);
      document.getElementById(pair).classList.add(newClass);
    };

    /* Exception for chest - this is ugly */
    if (activePart === 'chest' && attribute === ('width' || 'vertical gap')) {
      var bodyContainer = document.getElementById('body-container');
      bodyContainer.classList.remove(currentClass);
      bodyContainer.classList.add(newClass);
    };

  }
  return false;

};

/* Initial data model */
var getDatafromElements = function(els) {

  for (var i = 0; i < els.length; i++) {
    var el = els[i];

    /* Add body parts as keys */
    storedBody[el.id] = {};

    /* Grab all modifiable classnames and add them to corresponding keys */
    for (var key in config) {
      var match = els[i].className.search(key);
      if (match > -1) {
        var value = getClassFromEl(el, key);
        storedBody[els[i].id][key] = value;
      }
    }
  }
  return storedBody;
};

var initialize = function() {

  // Need to actually save data to params
  var params = false;

  if (params) {
    storedBody = getDatafromParams();
    for (part in storedBody) {
      setBodyPart(part, storedBody);
    }
  } else {
    storedBody = getDatafromElements(configurable);
  }

};

initialize();
