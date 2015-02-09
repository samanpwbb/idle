var background = document.getElementsByClassName('js-background')[0],
  form = document.getElementsByClassName('js-form')[0],
  bodyparts = document.getElementsByClassName('js-configurable'),
  storedBody = {},
  config = {
    'special': {
      'min':0,
      'max':2,
      'form': 'list',
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
          'feet',
          ' '
        ],
        'leg-lower-left': [
          'none',
          'feet',
          ' '
        ],
        'arm-upper-left': [
          'none',
          'detail',
          'wing'
        ],
        'arm-upper-right': [
          'none',
          'detail',
          'wing'
        ]
      }
    },
    'background': {
      'min':0,
      'max':17,
      'form': 'list'
    },
    'margint': {
      'min':-4,
      'max':4,
      'form': 'position'
    },
    'marginb': {
      'min':-4,
      'max':4,
      'form': 'position'
    },
    'marginl': {
      'min':-4,
      'max':4,
      'form': 'position'
    },
    'marginr': {
      'min':-4,
      'max':4,
      'form': 'position'
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

for (var i = 0;i < bodyparts.length; i++) {
  bodyparts[i].addEventListener('mouseover', function(ev) {
    for (var i = 0; i < bodyparts.length; i++) {
      bodyparts[i].classList.remove('hover');
    }
    ev.currentTarget.classList.add('hover');
    ev.stopPropagation();
  });

  bodyparts[i].addEventListener('mouseleave', function(ev) {
    ev.currentTarget.classList.remove('hover');
    ev.stopPropagation();
  });

  bodyparts[i].addEventListener('click', function(ev) {
    if (ev.target.classList.contains('button')) return false;
    handleInput(ev.currentTarget);
    ev.stopPropagation();
  });
}

function handleInput(target) {
  var isActive = target ? target.classList.contains('active') : false;
  var isBodyPart = target.classList.contains('js-configurable');

  resetBody();
  form.classList.add('in');

  if (!isActive && isBodyPart) {
    makeForm(target);
    positionForm(target);
  } else {
    form.classList.remove('in');

    window.setTimeout(function() {
      form.innerHTML = '';
      form.style.bottom = null;
      form.style.left = null;
    }, 250);

  }

};

function resetBody() {
  for (var i = 0; i < bodyparts.length; i++) {
    bodyparts[i].classList.remove('active');
  }
}

function makeForm(bodyPart) {
  form.innerHTML = '';

  bodyPart.classList.add('active');
  var fields = document.createElement('DIV');
    fields.id = 'form-' + bodyPart.id;
    fields.className = 'js-fields fields center-y';

  // Create form fields
  for (var key in config) {
    var match = bodyPart.className.search(key);
    var count = (config[key].max - config[key].min) + 1;

    var field = document.createElement('DIV');
      field.id = 'field-' + key;
      field.className = 'cf field js-field';


    // Only labels for increments
    if (config[key].form === 'increment') {
      var label = document.createElement('DIV');
        label.className = 'block label';

      var labelText = document.createTextNode(key);
        label.appendChild(labelText);
        field.appendChild(label);
    }


    if (match > -1) {
      fields.appendChild(field);

      // Create form elements
      switch (config[key].form) {
        case 'list':
          for (var i = 0; i < count;i++ ) {
            var button = document.createElement('BUTTON');
            button.dataset.attribute = key;
            button.dataset.bodypart = bodyPart.id;
            button.dataset.number = config[key].min + i;
            button.className = 'attr-' + key + i + ' button-' + config[key].form + ' button js-input';
            if (config[key].names) {
              var nameList = config[key].names[bodyPart.id];
              var buttonName = document.createTextNode(nameList[i]);
              button.appendChild(buttonName);
            }
            if (parseInt(button.dataset.number) === storedBody[bodyPart.id][key]) {
              button.className += ' active';
            }
            button.addEventListener('click', function() {
              updateData(this.dataset.bodypart, this.dataset.attribute, parseInt(this.dataset.number));
            });
            field.appendChild(button);
          }
        break;
        case 'position':
          for (var i = 0; i < 2; i++) {
            var button = document.createElement('BUTTON');
            var change = (i === 0) ? -1 : 1;

            button.dataset.attribute = key;
            button.dataset.bodypart = bodyPart.id;
            button.dataset.number = storedBody[bodyPart.id][key] + change;
            button.className = key + ' position' + change + ' button-' + config[key].form + ' js-input button ';

            if (parseInt(button.dataset.number) > config[key].max || parseInt(button.dataset.number) < config[key].min) {
              button.className += ' disable ';
            }

            button.addEventListener('click', function() {
              updateData(this.dataset.bodypart, this.dataset.attribute, parseInt(this.dataset.number));
            });

            field.appendChild(button);
          }
        break;
        case 'increment':
          var range = document.createElement('INPUT');
          range.type = 'range';
          range.dataset.attribute = key;
          range.dataset.bodypart = bodyPart.id;
          range.className = 'button-' + config[key].form + ' js-input';
          range.step = 1;
          range.min = config[key].min;
          range.max = config[key].max;
          range.value = storedBody[bodyPart.id][key];
          range.addEventListener('change', function() {
            updateData(this.dataset.bodypart, this.dataset.attribute, parseInt(this.value));
          });
          field.appendChild(range);
        break;

        default:
        break;
      }
    }
  }

  form.appendChild(fields);

};

function positionForm(el) {
  if (!el) return false;
  var topSpace = Math.floor(el.getBoundingClientRect().top);
  var rightSpace = Math.floor(el.getBoundingClientRect().right);
  var partHeight = Math.floor(el.offsetHeight);
  var formWidth = Math.floor(form.offsetWidth);
  var isRight = rightSpace < window.innerWidth / 2;
  form.style.bottom = window.innerHeight - (topSpace + partHeight/2) + 'px';
  form.style.left = !isRight ? rightSpace + 40 + 'px' : rightSpace - (formWidth + partHeight) - 20  + 'px';
}

function getClassFromEl(el, attributeName) {
  var regex = new RegExp(attributeName + '[0-9\-]');
  for (var i = 0; i < el.classList.length; i++) {
    if (el.classList[i].match(regex)) {
      return el.classList[i];
    }
  }
};

function getNumberFromClass(className) {
  var index = className.search(/[0-9\-]/);
  return parseInt(className.substr(index));
};

function updateData(activePart, attribute, number) {

  /* Update data */
  storedBody[activePart][attribute] = number;

  /* Update body */
  setBodyPart(activePart, storedBody);

  /* Update form */
  makeForm(document.getElementById(activePart));

  /* Update query string */
  makeQueryString(storedBody);
  getShortUrl();

};

function setBodyPart(activePart, data) {

  var el = document.getElementById(activePart);

  for (attribute in data[activePart]) {
    var currentClass = getClassFromEl(el, attribute);
    var newClass = attribute + data[activePart][attribute];

    el.classList.remove(currentClass);
    el.classList.add(newClass);

    /* Exception for chest - this is ugly */
    if (activePart === 'chest' && attribute === ('width' || 'vertical gap')) {
      var bodyContainer = document.getElementById('body-container');
      bodyContainer.classList.remove(currentClass);
      bodyContainer.classList.add(newClass);
    };

  }
  return false;

};

function makeQueryString(data) {

  var stringified = '';
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    stringified += queryString.stringify({
      part: keys[i],
      nested: JSON.stringify(data[keys[i]])
    });
    if (i !== (keys.length - 1)) {
      stringified += '&';
    }
  }
  window.location.hash = stringified;

  getDataFromQueryString(stringified);
};

function getDataFromQueryString(querystring) {
  var data = queryString.parse(querystring);
  var attributes = []
  for (var i = 0; i < data.nested.length; i++) {
    attributes.push(JSON.parse(data.nested[i]));
  }

  var newBody = {};
  for (var i = 0; i < attributes.length; i++) {
    newBody[data.part[i]] = attributes[i];
  }

  return newBody;
};

/* Initial data model */
function getDataFromElements(els) {

  for (var i = 0; i < els.length; i++) {
    var el = els[i];

    /* Add body parts as keys */
    storedBody[el.id] = {};

    /* Grab all modifiable classnames and add them to corresponding keys */
    for (var key in config) {
      var match = els[i].className.search(key);
      if (match > -1) {
        var className = getClassFromEl(el, key);
        var value = getNumberFromClass(className);
        storedBody[els[i].id][key] = value;
      }
    }
  }
  return storedBody;
};

function initialize() {

  var params = window.location.hash;

  getShortUrl();

  if (params) {
    storedBody = getDataFromQueryString(params);
    for (part in storedBody) {
      setBodyPart(part, storedBody);
    }
  } else {
    storedBody = getDataFromElements(bodyparts);
  }

};

initialize();

/* sharing */

function getShortUrl() {
  var request = new XMLHttpRequest();
  var url = 'https://api-ssl.bitly.com/v3/shorten?access_token=38ed1d345cbcbf9f7234601fca24aeb15d3939e5&longUrl=' + window.location.href;
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      renderShortUrl(data.url);
    } else {
      // We reached our target server, but it returned an error
      // TODO
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    // TODO
  };

  request.send();
}

function renderShortUrl(url) {
  if (url) {
    document.getElementsByClassName('js-share')[0].innerHTML = url;
  }
}
