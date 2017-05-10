"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ImportClause_1 = require("../components/ImportClause");
/**
 * Handles the imports merge
 *
 * @export
 * @class ImportMerge
 */
var ImportMerge = (function () {
    /**
     * Creates an instance of ImportMerge.
     * @param {ts.SourceFile} base
     * @param {ts.SourceFile} patch
     *
     * @memberof ImportMerge
     */
    function ImportMerge(base, patch) {
        /**
         * Array of {@link ImportCaluse}'s
         *
         * @private
         * @type {ImportClause []}
         * @memberof ImportMerge
         */
        this.imports = [];
        /**
         * Array of strings to write the result of the merge
         *
         * @private
         * @type {String []}
         * @memberof ImportMerge
         */
        this.result = [];
        this.sourceFile = base;
        this.sourceFilePatch = patch;
    }
    /**
     * Builds an array of {@link ImportClause}
     *
     * @memberof ImportMerge
     */
    ImportMerge.prototype.merge = function () {
        var _this = this;
        this.sourceFile.getChildAt(0).getChildren().forEach(function (child) {
            switch (child.kind) {
                case ts.SyntaxKind.ImportDeclaration:
                    var importElement_1 = new ImportClause_1.ImportClause();
                    importElement_1.setModule(child.moduleSpecifier.text);
                    if (child.importClause) {
                        if (child.importClause.namedBindings) {
                            if (child.importClause.namedBindings.kind == ts.SyntaxKind.NamedImports) {
                                child.importClause.namedBindings.elements.forEach(function (named) {
                                    importElement_1.addNamed(named.name.text);
                                });
                            }
                            else {
                                importElement_1.setNamespace(child.importClause.namedBindings.name.text);
                            }
                        }
                    }
                    else {
                        importElement_1.setSpaceBinding(false);
                    }
                    _this.imports.push(importElement_1);
                    break;
            }
        });
        this.mergeImports();
    };
    /**
     * Merge the {@link ImportClause}'s existent in both {@link ts.SourceFile}'s
     *
     * @memberof ImportMerge
     */
    ImportMerge.prototype.mergeImports = function () {
        var _this = this;
        this.sourceFilePatch.getChildAt(0).getChildren().forEach(function (childPatch) {
            var exists = false;
            switch (childPatch.kind) {
                case ts.SyntaxKind.ImportDeclaration:
                    _this.imports.forEach(function (importElement) {
                        if (childPatch.moduleSpecifier.text == importElement.getModule()) {
                            exists = true;
                            if (importElement.getNameSpace() != "" && importElement.getNamed().length > 0) {
                                childPatch.importClause.namedBindings.elements.forEach(function (clause) {
                                    if (!importElement.contains(clause.name.text)) {
                                        importElement.addNamed(clause.name.text);
                                    }
                                });
                            }
                        }
                    });
                    break;
            }
        });
        this.imports.forEach(function (importElement) {
            _this.result.push(importElement.toString());
        });
    };
    /**
     * Adds the nonexistent {@link ImportClause}'s at base file to the result
     *
     * @returns the result string of the merge
     *
     * @memberof ImportMerge
     */
    ImportMerge.prototype.addPatchImports = function () {
        var _this = this;
        this.sourceFilePatch.getChildAt(0).getChildren().forEach(function (childPatch) {
            if (childPatch.kind == ts.SyntaxKind.ImportDeclaration) {
                var exists = false;
                for (var _i = 0, _a = _this.imports; _i < _a.length; _i++) {
                    var element = _a[_i];
                    if (element.getModule() == childPatch.moduleSpecifier.text) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    _this.result.push(childPatch.getFullText(_this.sourceFilePatch));
                }
            }
        });
        return this.result.join("");
    };
    return ImportMerge;
}());
exports.ImportMerge = ImportMerge;
//# sourceMappingURL=ImportMerge.js.map