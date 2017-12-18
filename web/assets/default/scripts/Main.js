/* MAIN SCRIPT */
var allDataComponents = document.querySelectorAll("[data-component]");
var allComponents = new Array;

for (var i = 0; i < allDataComponents.length; i++) {
    var component = allDataComponents[i].dataset.component;

    if (allComponents.indexOf(component) == -1) {
        allComponents.push(component);
    }
}

for (var i = 0; i < allComponents.length; i++) {
    var script = document.createElement('script');
    script.src = './assets/default/scripts/Components/' + allComponents[i] + '.js';
    document.head.appendChild(script);
}

function isScriptLoaded(url) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src == url) {
            return true;
        }
    }
    return false;
}
