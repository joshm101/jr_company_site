System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ContentTypeEnum;
    return {
        setters: [],
        execute: function () {
            (function (ContentTypeEnum) {
                ContentTypeEnum[ContentTypeEnum["Music"] = 0] = "Music";
                ContentTypeEnum[ContentTypeEnum["FieldRecordings"] = 1] = "FieldRecordings";
                ContentTypeEnum[ContentTypeEnum["Film"] = 2] = "Film";
                ContentTypeEnum[ContentTypeEnum["Eng"] = 3] = "Eng";
                ContentTypeEnum[ContentTypeEnum["About"] = 4] = "About";
                ContentTypeEnum[ContentTypeEnum["ContactInfo"] = 5] = "ContactInfo";
            })(ContentTypeEnum || (ContentTypeEnum = {}));
            exports_1("ContentTypeEnum", ContentTypeEnum);
        }
    };
});
