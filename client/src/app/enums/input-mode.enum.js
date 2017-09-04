System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var InputModeEnum;
    return {
        setters: [],
        execute: function () {
            (function (InputModeEnum) {
                InputModeEnum[InputModeEnum["SingleLine"] = 0] = "SingleLine";
                InputModeEnum[InputModeEnum["MultiLine"] = 1] = "MultiLine";
            })(InputModeEnum || (InputModeEnum = {}));
            exports_1("InputModeEnum", InputModeEnum);
            ;
        }
    };
});
