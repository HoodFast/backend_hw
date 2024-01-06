"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = process.env.PORT || 80;
settings_1.app.listen(port, () => {
    console.log(`App start on port ${port}`);
});
