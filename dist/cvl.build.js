"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******
 * Component View Layer
 * ES6 extendable view component for state managment
 * MIT License
 * Copyright (c) 2017 Omar Gonzalez
 * Requires jQuery
 */

var Layer = window.Layer || {};

/**
 * Logger Class 
 * Store useful logs and errors
 * Save logs : Layer.logs.save(log)
 * Print stored logs : Layer.logs.print
 * Dump log array : layer.logs.dump
 */

Layer.Logger = function () {
    function _class() {
        _classCallCheck(this, _class);

        this.logs = [];
    }

    _createClass(_class, [{
        key: "save",
        value: function save(log) {
            this.logs.push(log);
        }
    }, {
        key: "delete",
        value: function _delete() {
            this.logs = [];
        }
    }, {
        key: "print",
        get: function get() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.logs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var log = _step.value;

                    console.log("CVL:Log - " + log);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "dump",
        get: function get() {
            return this.logs;
        }
    }]);

    return _class;
}();

Layer.logs = new Layer.Logger();

/**
 * Core Static Utility Functions
 * Core static intpl - parse Interpolation
 * Reconciliates component props with template markup 
 */

Layer.Core = function () {
    function _class2() {
        _classCallCheck(this, _class2);
    }

    _createClass(_class2, null, [{
        key: "intpl",
        value: function intpl(template, props) {
            if (!template || !props) {
                return null;
            }

            var htmlArray = template.split(/{{|}}/);
            var values = [];
            var newValues = [];

            //Uneven index = interpolation values
            for (var i = 0; i < htmlArray.length; i++) {
                if (i % 2 !== 0) {
                    var val = htmlArray[i].replace(/ /g, "");
                    values.push(val);
                    newValues.push(val);
                }
            }

            //Match props values with markup placeholders
            for (var property in props) {
                if (props.hasOwnProperty(property)) {
                    for (var _i = 0; _i < values.length; _i++) {
                        try {
                            if (values[_i].indexOf(property) !== -1) {
                                values[_i] = props[property];
                            }
                        } catch (e) {
                            //May yield type error, but whatevs
                        }
                    }
                }
            }

            //Clean undefined props
            for (var _i2 = 0; _i2 < values.length; _i2++) {
                if (values[_i2] === newValues[_i2]) {
                    values[_i2] = "";
                }
            }

            //Rebuild markup with new values
            var vi = 0;
            for (var _i3 = 0; _i3 < htmlArray.length; _i3++) {
                if (_i3 % 2 !== 0) {
                    htmlArray[_i3] = values[vi];
                    vi++;
                }
            }

            return htmlArray.join("");
        }
    }, {
        key: "resetProps",
        value: function resetProps(newProps, currentProps) {
            if (!currentProps) {
                return newProps;
            }

            for (var prop in newProps) {
                if (currentProps.hasOwnProperty(prop)) {
                    currentProps[prop] = newProps[prop];
                }
            }
            return currentProps;
        }
    }]);

    return _class2;
}();

/**
 * AJAX Static Methods
 * Component (internal) related AJAX Calls 
 * & Convinience (external) AJAX methdos 
 */

Layer.HTTP = function () {
    function _class3() {
        _classCallCheck(this, _class3);
    }

    /**
     * Private HTTP._GET() Takes component dependency injection
     * to fetch component related data
     */

    _createClass(_class3, null, [{
        key: "_GET",
        value: function _GET(url, cb) {
            jQuery.ajax({
                url: url,
                type: "GET"
            }).done(function (data, textStatus, jqXHR) {
                Layer.logs.save("AJAX get done : " + jqXHR.statusText + " " + jqXHR.status);
                if (jqXHR.responseJSON) {
                    cb.setProps(jqXHR.responseJSON);
                } else {
                    cb.setHtml(data);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Layer.logs.save("AJAX get error : " + errorThrown);
            }).always(function () {
                /* ... */
                Layer.logs.save("Executed AJAX get with url : " + url);
            });
        }

        /**
         * Public HTTP.GET() - manualy fetch data
         * @param : url 
         * @param : cb()
         * return data & error in cb()
         */

    }, {
        key: "GET",
        value: function GET(url, cb) {
            jQuery.ajax({
                url: url,
                type: "GET"
            }).done(function (data, textStatus, jqXHR) {
                Layer.logs.save("AJAX get done : " + jqXHR.statusText + " " + jqXHR.status);
                return cb(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                Layer.logs.save("AJAX get error : " + errorThrown);
                return errorThrown;
            }).always(function () {
                /* ... */
                Layer.logs.save("Executed AJAX get with url : " + url);
            });
        }
    }]);

    return _class3;
}();

/**
 * Component View Layer - View Component
 * @param:data.GET, data.POST method & url
 * @param:data.sel main element selector
 * @param:data.html markup string
 * @param:_elements html element jquery object
 * @param:props{} - interpolation val object
 */

Layer.View = function (_Layer$Core) {
    _inherits(View, _Layer$Core);

    function View(data) {
        _classCallCheck(this, View);

        var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this));

        if (!data) {
            throw "View component requires a data object for initialization";
        }

        //if markup source an ajax request
        if (data.GET) {
            _this._method = "GET";
            _this._endpoint = data.GET;
        }

        if ($(data.sel).length === 0) {
            return _possibleConstructorReturn(_this);
        }

        _this._selector = data.sel;
        _this._elements = $(data.sel);

        //Component markup 
        _this._html = data.html;
        _this._templateHtml = data.html;

        //Component props 
        _this._props = data.props;

        //Life Cycle Call Backs
        _this._onUpdate = null;
        _this._onRemove = null;

        //Stored logs
        _this._logs = [];

        //Mount Component with initial state
        _this.update();
        return _this;
    }

    _createClass(View, [{
        key: "setCall",
        value: function setCall(call) {
            if (!call) {
                throw "setCall requires method and endpoint";
            }
            this.method = this._splitP(call)[0];
            this.method = this.method.toUpperCase();
            this.endpoint = this._splitP(call)[1];
        }
    }, {
        key: "update",
        value: function update(avoidRecursion) {

            if (this.method === "GET" && avoidRecursion === undefined) {
                Layer.HTTP._GET(this._endpoint, this);
            }

            $(this._elements).html(Layer.Core.intpl(this._templateHtml, this._props) ? Layer.Core.intpl(this._templateHtml, this._props) : this._html);

            if (typeof this._onUpdate === "function") {
                this._onUpdate();
            }
        }
    }, {
        key: "remove",
        value: function remove() {
            $(this._elements).html("");

            if (typeof this._onRemove === "function") {
                this._onRemove();
            }
        }

        /**
         * Getters
         */

    }, {
        key: "setSelector",


        /**
         * Setters
         */

        value: function setSelector(sel) {
            this._selector = sel;
            this.update();
        }
    }, {
        key: "setElement",
        value: function setElement(element) {
            this._elements = element;
            this.update();
        }
    }, {
        key: "setHtml",
        value: function setHtml(html) {
            this._html = html;
            this._templateHtml = html;
            this.update(true);
        }
    }, {
        key: "setState",
        value: function setState(data) {
            this._state = state;
            this.update();
        }
    }, {
        key: "setMethod",
        value: function setMethod(method) {
            this._method = method;
            this.update();
        }
    }, {
        key: "setProps",
        value: function setProps(newProps) {
            this._props = Layer.Core.resetProps(newProps, this._props);
            this.update(true);
        }
    }, {
        key: "setEndpoint",
        value: function setEndpoint(url) {
            this._endpoint = url;
            this.update();
        }

        /**
         * Lyfecycle Call Backs
         * Excute on component state change
         */

    }, {
        key: "onUpdate",
        value: function onUpdate(cb) {
            if (typeof cb === "function") {
                this._onUpdate = cb;
            }
        }
    }, {
        key: "onRemove",
        value: function onRemove(cb) {
            if (typeof cb === "function") {
                this._onRemove = cb;
            }
        }
    }, {
        key: "props",
        get: function get() {
            return this._props;
        }
    }, {
        key: "method",
        get: function get() {
            return this._method;
        }
    }, {
        key: "selector",
        get: function get() {
            return this._selector;
        }
    }, {
        key: "element",
        get: function get() {
            return this._elements;
        }
    }, {
        key: "state",
        get: function get() {
            return this._state;
        }
    }, {
        key: "html",
        get: function get() {
            return this._html;
        }
    }, {
        key: "endpoint",
        get: function get() {
            return this._endpoint;
        }
    }]);

    return View;
}(Layer.Core);
/******
 * CVL - Usage Sample
 * MIT License
 * Copyright (c) 2017 Omar Gonzalez
 */

//@prepros-prepend cvl.js

/**
 * You can initialize a view component with an AJAX Call Endpoint
 */

var jumbo = new Layer.View({
    GET: "sample-data/jumbotron.html",
    sel: ".jumbo"
});

/**
 * You manually set the props object properties
 */

jumbo.setProps({
    title: "Component View Layer",
    author: "Omar Gonzalez"
});

/**
 * Or you can set up a new component with markup
 * and set the props object on initialization
 */

var usage = new Layer.View({
    props: {
        time: new Date().toLocaleString(),
        markupInit: "\n let hi = new Layer.View({\n     props:{name:\"dude\"}\n     html: \"&lth1&gtHello {{ name }}&lt/h1&gt\",\n     sel: \"#my-div\"\n });",
        ajaxInit: "\nlet jumbo = new Layer.View({\n    GET: \"sample-data/jumbotron.html\",\n    sel: \".jumbo\"\n});" },
    html: "<div class=\"container-fluid\">\n            <div class=\"row\">\n                <div class=\"col-md-6 col-md-offset-3\">\n                    <h4>Features & Usage</h4>\n                    <p>CVL can handle dynamic data via interpolation, such as:</p>\n                    <p>Page loaded on: <strong>{{ time }}</strong> </p>\n                    <p>You can manage object state with the <code>View.props</code> object and related methods:</p>\n                    <p><code>component.setProps({name:\"Omar Gonzalez\"});</code></p>\n                    <p>A view component can be initialized with markup :</p>\n                    <p><pre>{{ markupInit }}</pre></p>\n                    <p>Alternately you can initialize it with an AJAX call:\n                    <p><pre>{{ ajaxInit }}</pre></p>\n                    <p>It also plays nice with JSON data :</p>\n                </div>\n            </div>\n        </div>",
    sel: '.usage'
});

/**
* It also plays nice with JSON
*/

var cat = new Layer.View({
    GET: "sample-data/cat.json",
    html: "<h4>Cat Profile</h4>\n            <img src=\"{{\xA0imgURL }}\">\n            <ul>\n                <li>Name: {{ name }}</li>\n                <li>Age: {{ age }}</li>\n                <li>Color: {{ color }}</li>\n                <li>Bio: {{ bio }}</li>\n            </ul>",
    sel: ".cat"
});

var catSource = new Layer.View({
    html: "\n<pre><xmp>\nlet cat = new Layer.View({\n    GET:\"sample-data/cat.json\",\n    html: `<h4>Cat Profile</h4>\n            <img src=\"{{\xA0imgURL }}\">\n            <ul>\n                <li>Name: {{ name }}</li>\n                <li>Age: {{ age }}</li>\n                <li>Color: {{ color }}</li>\n                <li>Bio: {{ bio }}</li>\n            </ul>`,\n    sel:\".cat\"\n});</xmp></pre>",
    sel: ".cat-src"
});

var lifeCycle = new Layer.View({
    html: "\n        <div class=\"container\">\n                <div class=\"row\">\n                    <div class=\"col-md-6 col-md-offset-3\">\n                        <h4>Component Lilfecyle</h4>\n                        <p>You can set call back functions for the update & remove event</p>\n                        <p>\n<pre>\ncat.onUpdate(function(){\n    alert(this.props.name)//<-- access lexical scope of cat component\n});\n\ncat.onRemove(function(){\n    //do something.. \n});\n</pre>\n                    <p>\n                    </div>\n                </div>\n            </div>",
    sel: '.lifecycle'
});

var dep = new Layer.View({
    html: "<div class=\"container\">\n                <div class=\"row\">\n                    <div class=\"col-md-6 col-md-offset-3\">\n                        <h4>Dependencies</h4>\n                        <p>CVL uses jQuery for DOM manipulation and Ajax calls. jQuery functionality can easily be removed, if for whatever fancy you prefer native methods</p>\n                        <p>CVL ES6 source runs in every modern \"evergreen\" browser no problem. However, I prefer to transpile with Babel, it is merely 7kb minified to ES5</p>\n                    </div> \n                </div> \n            </div>",
    sel: '.dependencies'
});

var foot = new Layer.View({
    html: "<div class=\"container\">\n            <div class=\"row\">\n                <hr>\n                <p> Component View Layer, MIT License * Copyright (c) 2017 <a href=\"https://github.com/Omar-Gonzalez\">Omar Gonzalez</a></p><br>\n            </div>\n        </div>",
    sel: '.foot'
});

var test = new Layer.View({
    html: "hey",
    sel: ".nooo"
});
//# sourceMappingURL=cvl.build.js.map