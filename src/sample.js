/******
 * CVL - Usage Sample
 * MIT License
 * Copyright (c) 2017 Omar Gonzalez
 */

//@prepros-prepend cvl.js

/**
 * You can initialize a view component with an AJAX Call Endpoint
 */

let jumbo = new Layer.View({
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

let usage = new Layer.View({
    props: {
        time: new Date().toLocaleString(),
        markupInit:`
 let hi = new Layer.View({
     props:{name:"dude"}
     html: "&lth1&gtHello {{ name }}&lt/h1&gt",
     sel: "#my-div"
 });`,
        ajaxInit:`
let jumbo = new Layer.View({
    GET: "sample-data/jumbotron.html",
    sel: ".jumbo"
});`},
    html: `<div class="container-fluid">
            <div class="row">
                <div class="col-md-6 col-md-offset-3">
                    <h4>Features & Usage</h4>
                    <p>CVL can handle dynamic data via interpolation, such as:</p>
                    <p>Page loaded on: <strong>{{ time }}</strong> </p>
                    <p>You can manage object state with the <code>View.props</code> object and related methods:</p>
                    <p><code>component.setProps({name:\"Omar Gonzalez\"});</code></p>
                    <p>A view component can be initialized with markup :</p>
                    <p><pre>{{ markupInit }}</pre></p>
                    <p>Alternately you can initialize it with an AJAX call:
                    <p><pre>{{ ajaxInit }}</pre></p>
                    <p>It also plays nice with JSON data :</p>
                </div>
            </div>
        </div>`,
    sel: '.usage'
});

/**
* It also plays nice with JSON
*/

let cat = new Layer.View({
    GET:"sample-data/cat.json",
    html: `<h4>Cat Profile</h4>
            <img src="{{ imgURL }}">
            <ul>
                <li>Name: {{ name }}</li>
                <li>Age: {{ age }}</li>
                <li>Color: {{ color }}</li>
                <li>Bio: {{ bio }}</li>
            </ul>`,
    sel:".cat"
});

let catSource = new Layer.View({
    html:`
<pre><xmp>
let cat = new Layer.View({
    GET:"sample-data/cat.json",
    html: \`<h4>Cat Profile</h4>
            <img src="{{ imgURL }}">
            <ul>
                <li>Name: {{ name }}</li>
                <li>Age: {{ age }}</li>
                <li>Color: {{ color }}</li>
                <li>Bio: {{ bio }}</li>
            </ul>\`,
    sel:".cat"
});</xmp></pre>`,
    sel:".cat-src"
});

let lifeCycle = new Layer.View({
    html:`
        <div class="container">
                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <h4>Component Lilfecyle</h4>
                        <p>You can set call back functions for the update & remove event</p>
                        <p>
<pre>
cat.onUpdate(function(){
    alert(this.props.name)//<-- access lexical scope of cat component
});

cat.onRemove(function(){
    //do something.. 
});
</pre>
                    <p>
                    </div>
                </div>
            </div>`,
    sel:'.lifecycle'
});

let dep = new Layer.View({
    html:`<div class="container">
                <div class="row">
                    <div class="col-md-6 col-md-offset-3">
                        <h4>Dependencies</h4>
                        <p>CVL uses jQuery for DOM manipulation and Ajax calls. jQuery functionality can easily be removed, if for whatever fancy you prefer native methods</p>
                        <p>CVL ES6 source runs in every modern "evergreen" browser no problem. However, I prefer to transpile with Babel, it is merely 7kb minified to ES5</p>
                    </div> 
                </div> 
            </div>`,
    sel:'.dependencies'
});

let foot = new Layer.View({
    html:`<div class="container">
            <div class="row">
                <hr>
                <p> Component View Layer, MIT License * Copyright (c) 2017 <a href="https://github.com/Omar-Gonzalez">Omar Gonzalez</a></p><br>
            </div>
        </div>`,
    sel:'.foot'
});

let test = new Layer.View({
    html:"hey",
    sel:".nooo"
});