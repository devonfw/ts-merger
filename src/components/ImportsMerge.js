"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImportsMerge = (function () {
    function ImportsMerge() {
        this.module = "";
        this.named = [];
        this.nameSpace = "";
        this.spaceBinding = true;
    }
    ImportsMerge.prototype.addNamed = function (named) {
        this.named.push(named);
    };
    ImportsMerge.prototype.setModule = function (module) {
        this.module = module;
    };
    ImportsMerge.prototype.setNamespace = function (nameSpace) {
        this.nameSpace = nameSpace;
    };
    ImportsMerge.prototype.contains = function (named) {
        if (this.named.indexOf(named) >= 0) {
            return true;
        }
        else {
            return false;
        }
    };
    ImportsMerge.prototype.setSpaceBinding = function (flag) {
        this.spaceBinding = flag;
    };
    ImportsMerge.prototype.getNameSpace = function () {
        return this.nameSpace;
    };
    ImportsMerge.prototype.getNamed = function () {
        return this.named;
    };
    ImportsMerge.prototype.getModule = function () {
        return this.module;
    };
    ImportsMerge.prototype.toString = function () {
        var _this = this;
        var clause = [];
        if (!this.spaceBinding) {
            clause.push("import '", this.module, "';\n");
        }
        else {
            clause.push("import ");
            if (this.named.length != 0) {
                clause.push("{ ");
                this.named.forEach(function (name) {
                    clause.push(name);
                    if (_this.named.indexOf(name) < _this.named.length - 1) {
                        clause.push(", ");
                    }
                });
                clause.push(" } from '", this.module, "';\n");
            }
            else {
                clause.push("* as ", this.nameSpace, " from '", this.module, "';\n");
            }
        }
        return clause.join("");
    };
    return ImportsMerge;
}());
exports.ImportsMerge = ImportsMerge;
//# sourceMappingURL=ImportsMerge.js.map