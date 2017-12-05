/******
 * Component View Layer
 * ES6 extendable view component for state managment
 * MIT License
 * Copyright (c) 2017 Omar Gonzalez
 * Requires jQuery
 */

let Layer = window.Layer || {};

/**
 * Core Class - Handles interpolation and props refresh/state
 * Core intpl - parse Interpolation
 * Reconciliates component props with template markup 
 * resetProps - matches template tags with new props
 */

Layer.Core = class {

    constructor() {}

    intpl() {
        if (!this._templateHtml || !this._props) {
            return null;
        }

        let htmlArray = this._templateHtml.split(/{{|}}/);
        let values = [];
        let newValues = [];
        this._templateTags = [];

        //Uneven index = interpolation values
        for (let i = 0; i < htmlArray.length; i++) {
            if (i % 2 !== 0) {
                let val = htmlArray[i].replace(/ /g, "");
                values.push(val);
                newValues.push(val);
                this._templateTags.push(val);
            }
        }

        //Match props values with markup placeholders
        for (let property in this._props) {
            if (this._props.hasOwnProperty(property)) {
                for (let i = 0; i < values.length; i++) {
                    try {
                        if (values[i].indexOf(property) !== -1) {
                            values[i] = this._props[property];
                        }
                    } catch (e) {
                        //May yield type error, but whatevs
                    }
                }
            }
        }

        //Clean undefined props
        for (let i = 0; i < values.length; i++) {
            if (values[i] === newValues[i]) {
                values[i] = "";
            }
        }

        //Rebuild markup with new values
        var vi = 0;
        for (let i = 0; i < htmlArray.length; i++) {
            if (i % 2 !== 0) {
                htmlArray[i] = values[vi];
                vi++;
            }
        }

        return htmlArray.join("");
    }

    resetProps(newProps) {        
        if (!this._props) {
            return newProps;
        }

        for (let prop in newProps) {
            for (let tag of this._templateTags){
                if(prop === tag){
                    this._props[prop] = newProps[prop];
                }
            }
        }
        return this._props;
    }
};

/**
 * Component View Layer - View Component
 * @param:data.GET, data.POST method & url
 * @param:data.sel main element selector
 * @param:data.html markup string
 * @param:_elements html element jquery object
 * @param:props{} - interpolation val object
 */

Layer.View = class View extends Layer.Core {

    constructor(data) {
        super();
        if (!data) {
            throw "View component requires a data object for initialization";
        }

        //if markup source an ajax request
        if (data.GET) {
            this._method = "GET";
            this._endpoint = data.GET;
        }

        if ($(data.sel).length === 0) {
            Layer.logs.save("Unable to retrieve attach reference with : " + data.sel);
            return;
        }

        this._selector = data.sel;
        this._elements = $(data.sel);

        //Component markup 
        this._html = data.html;
        this._templateHtml = data.html;

        //Component props 
        this._props = data.props;

        //Life Cycle Call Backs
        this._onUpdate = null;
        this._onRemove = null;

        //Stored logs
        this._logs = [];

        //Mount Component with initial state
        this.update();
    }

    setCall(call) {
        if (!call) {
            throw "setCall requires method and endpoint";
        }
        this.method = this._splitP(call)[0];
        this.method = this.method.toUpperCase();
        this.endpoint = this._splitP(call)[1];
    }

    update(avoidRecursion) {

        if (this.method === "GET" && avoidRecursion === undefined) {
            Layer.HTTP._GET(this._endpoint, this);
        }

        $(this._elements).html(this.intpl() ? this.intpl() : this._html);

        if (typeof this._onUpdate === "function") {
            this._onUpdate();
        }
    }

    remove() {
        $(this._elements).html("");

        if (typeof this._onRemove === "function") {
            this._onRemove();
        }
    }

    /**
     * Getters
     */

    get props() {
        return this._props;
    }

    get method() {
        return this._method;
    }

    get selector() {
        return this._selector;
    }

    get element() {
        return this._elements;
    }

    get state() {
        return this._state;
    }

    get html() {
        return this._html;
    }

    get endpoint() {
        return this._endpoint;
    }

    /**
     * Setters
     */

    setSelector(sel) {
        this._selector = sel;
        this.update();
    }

    setElement(element) {
        this._elements = element;
        this.update();
    }

    setHtml(html) {
        this._html = html;
        this._templateHtml = html;
        this.update(true);
    }

    setState(data) {
        this._state = state;
        this.update();
    }

    setMethod(method) {
        this._method = method;
        this.update();
    }

    setProps(newProps) {
        this._props = this.resetProps(newProps);
        this.update(true);
    }

    setEndpoint(url) {
        this._endpoint = url;
        this.update();
    }

    /**
     * Lyfecycle Call Backs
     * Excute on component state change
     */

    onUpdate(cb) {
        if (typeof cb === "function") {
            this._onUpdate = cb;
        }
    }

    onRemove(cb) {
        if (typeof cb === "function") {
            this._onRemove = cb;
        }
    }
};

/**
 * AJAX Static Methods
 * Component (internal) related AJAX Calls 
 * & Convinience (external) AJAX methdos 
 */

Layer.HTTP = class {
    constructor() {}

    /**
     * Private HTTP._GET() Takes component dependency injection
     * to fetch component related data
     */

    static _GET(url, cb) {
        jQuery.ajax({
                url: url,
                type: "GET",
            })
            .done(function(data, textStatus, jqXHR) {
                Layer.logs.save("AJAX get done : " + jqXHR.statusText + " " + jqXHR.status);
                if (jqXHR.responseJSON) {
                    cb.setProps(jqXHR.responseJSON);
                } else {
                    cb.setHtml(data);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                Layer.logs.save("AJAX get error : " + errorThrown);
            })
            .always(function() {
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

    static GET(url, cb) {
        jQuery.ajax({
                url: url,
                type: "GET",
            })
            .done(function(data, textStatus, jqXHR) {
                Layer.logs.save("AJAX get done : " + jqXHR.statusText + " " + jqXHR.status);
                return cb(data);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                Layer.logs.save("AJAX get error : " + errorThrown);
                return errorThrown;
            })
            .always(function() {
                /* ... */
                Layer.logs.save("Executed AJAX get with url : " + url);
            });
    }
};

/**
 * Logger Class 
 * Store useful logs and errors
 * Save logs : Layer.logs.save(log)
 * Print stored logs : Layer.logs.print
 * Dump log array : layer.logs.dump
 */

Layer.Logger = class {
    constructor() {
        this.logs = [];
    }

    get print() {
        for (let log of this.logs) {
            console.log("CVL:Log - " + log);
        }
    }

    save(log) {
        this.logs.push(log);
    }

    get dump() {
        return this.logs;
    }

    delete() {
        this.logs = [];
    }
};

Layer.logs = new Layer.Logger();
