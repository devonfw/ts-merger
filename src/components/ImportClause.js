"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImportClause = (function () {
    function ImportClause() {
        this.module = "";
        this.named = [];
        this.nameSpace = "";
        this.spaceBinding = true;
    }
    ImportClause.prototype.addNamed = function (named) {
        this.named.push(named);
    };
    ImportClause.prototype.setModule = function (module) {
        this.module = module;
    };
    ImportClause.prototype.setNamespace = function (nameSpace) {
        this.nameSpace = nameSpace;
    };
    ImportClause.prototype.contains = function (named) {
        if (this.named.indexOf(named) >= 0) {
            return true;
        }
        else {
            return false;
        }
    };
    ImportClause.prototype.setSpaceBinding = function (flag) {
        this.spaceBinding = flag;
    };
    ImportClause.prototype.getNameSpace = function () {
        return this.nameSpace;
    };
    ImportClause.prototype.getNamed = function () {
        return this.named;
    };
    ImportClause.prototype.getModule = function () {
        return this.module;
    };
    ImportClause.prototype.toString = function () {
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
    return ImportClause;
}());
exports.ImportClause = ImportClause;
//# sourceMappingURL=ImportClause.js.map