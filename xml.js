if (typeof Object.assign != 'function') {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

var xmlToJson = (function () {
  var self = this;
  self.addToParent = function (parent, nodeName, obj) {
    if (!parent[nodeName]) {
      parent[nodeName] = obj;
    }
    else {
      if (!Array.isArray(parent[nodeName])) {
        var tmp = parent[nodeName];
        parent[nodeName] = [];
        parent[nodeName].push(tmp);
      }

      parent[nodeName].push(obj);
    }
  };

  self.convertXMLStringToDoc = function (str) {
    var xmlDoc = null;

    if (str && typeof str === 'string') {
      var parser = new DOMParser();

      xmlDoc = parser.parseFromString(str, 'application/xml');
    }

    return xmlDoc;
  }

  self.isXML = function (data) {
    var documentElement = (data ? data.ownerDocument || data : 0).documentElement;

    return documentElement ? documentElement.nodeName.toLowerCase() !== 'html' : false;
  };

  self.parseAttributes = function (node) {
    var attributes = node.attributes,
      obj = {};

    if (node.hasAttributes()) {
      for (var i = 0; i < attributes.length; i++) {
        obj[attributes[i].name] = self.parseValue(attributes[i].value);
      }
    }

    return obj;
  };

  self.parseChildren = function (parent, childNodes) {
    if (childNodes.length > 0) {
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {
          self.parseNode(parent, childNodes[i]);
        }
      }
    }
  };

  self.parseNode = function (parent, node) {
    var nodeName = node.nodeName,
      obj = Object.assign({}, self.parseAttributes(node)),
      tmp = null;

    if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {

      if (node.hasAttributes()) {
        obj['text'] = self.parseValue(node.childNodes[0].nodeValue);
      }

      else {
        obj = self.parseValue(node.childNodes[0].nodeValue);
      }
    }
    else {
      self.parseChildren(obj, node.childNodes);
    }

    self.addToParent(parent, nodeName, obj)

    return parent;
  };

  this.parseValue = function (val) {
    var num = Number(val);

    if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
      return (val.toLowerCase() == 'true');
    }

    return (isNaN(num)) ? val.trim() : (val.length == 0) ? null : num;
  };

  return {
    parse: function (xml) {
      if (xml && typeof xml === 'string') {
        xml = self.convertXMLStringToDoc(xml);
      }
      return (xml && self.isXML(xml)) ? self.parseNode({}, xml.firstChild) : null;
    }
  }
})();