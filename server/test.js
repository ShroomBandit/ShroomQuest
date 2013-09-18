var extend = require('./extend');

var Parent = extend(false, {
    init:function(val) {
        console.log('calling Parent init');
        this.prop = val;
    },
    parentMethod:function(){}
});

var Child = extend(Parent, {
    init:function(val) {
        console.log('calling Child init');
        Parent.call(this, val);
    },
    childMethod:function(){}
});

var Grandchild = extend(Child, {
    init:function(val) {
        console.log('calling Grandchild init');
        Child.call(this, val);
    },
    grandchildMethod:function(){}
});

console.log(Grandchild.prototype);
var t = new Grandchild('hi');
console.log(t, t.__proto__);
