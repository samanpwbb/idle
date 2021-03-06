var background = document.getElementsByClassName('js-background')[0],
  form = document.getElementsByClassName('js-form')[0],
  bodyparts = document.getElementsByClassName('js-configurable'),
  storedBody = {},
  config = {
    'sp': {
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
          'antenna'
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
    'bg': {
      'min':0,
      'max':17,
      'form': 'list'
    },
    'mgnt': {
      'min':-4,
      'max':4,
      'form': 'position'
    },
    'mgnb': {
      'min':-4,
      'max':4,
      'form': 'position'
    },
    'mgnl': {
      'min':-4,
      'max':4,
      'form': 'position'
    },
    'mgnr': {
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

  if (window.innerWidth >= 640) {
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
  }

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

  if (!isActive && isBodyPart) {
    form.classList.add('in');
    window.setTimeout(function() {
      form.classList.add('animate-all');
    }, 250);
    makeForm(target);
    positionForm(target);
  } else {
    form.classList.remove('animate-all');
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
  if (window.innerWidth <= 640) {
    document.getElementsByClassName('body-container-mobile')[0].classList.remove('offset');
  }
}

function makeForm(bodyPart) {
  form.innerHTML = '';

  if (window.innerWidth <= 640) {
    document.getElementsByClassName('body-container-mobile')[0].classList.add('offset');
  }

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
  if (window.innerWidth <= 640) {
    return false;
    form.style.bottom = null;
    form.style.left = null;
  }
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

  var keys = Object.keys(data);
  var encoded = '';

  for (var i = 0; i < keys.length; i++) {
    encoded += encodeURIComponent(JSON.stringify(data[keys[i]]));
    if (i !== (keys.length - 1)) {
      encoded += '&';
    }
  }

  window.location.hash = encoded;

};

function getDataFromQueryString(querystring) {
  var arrayOfStrings = decodeURIComponent(querystring).split('#').pop().split('&');

  var attributes = []
  for (var i = 0; i < arrayOfStrings.length; i++) {
    attributes.push(JSON.parse(arrayOfStrings[i]));
  }

  var newBody = {};
  for (var i = 0; i < attributes.length; i++) {
    newBody[bodyparts[i].id] = attributes[i];
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
  var longUrl = window.location.origin + window.location.pathname + encodeURIComponent(window.location.hash);
  var requestString = 'https://api-ssl.bitly.com/v3/shorten?access_token=38ed1d345cbcbf9f7234601fca24aeb15d3939e5&longUrl=' + longUrl;
  request.open('GET', requestString, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText).data;
      renderShortUrl(data.url);
    }
  };

  request.send();
}

document.getElementsByClassName('js-share')[0].addEventListener('click', function() {
  this.select();
});

function renderShortUrl(url) {
  var val = url || 'not available'
  var shareInput = document.getElementsByClassName('js-share')[0];

  shareInput.value = val;
  shareInput.size = Math.floor(val.length * 1.3333);

}
