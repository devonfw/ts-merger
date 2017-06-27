# TS-Merger
Generic TypeScript Merger

[![build status](https://travis-ci.org/oasp/ts-merger.svg?branch=master)](https://travis-ci.org/oasp/ts-merger)

## Usage

```javascript
let tsm = require('@oasp/ts-merger');
let mergedCode: string = tsm.merge(patchOverrides, 'path/to/base/file', 'path/to/patch/file', '/path/to/result/file', 'encoding');
```

Being:
- patchOverrides(**true**/**false**): Being false, base conflicts will have priority. With true, patch conflicts will have priority.  
- Path to result file: Leaving it as '' in case of no ouput file needed.
- encoding: **UTF-8** or **ISO-8895-1**. UTF-8 by default if encoding = ''

### Example
```javascript
let tsm = require('@oasp/ts-merger');
let mergedCode: string = tsm.merge(patchOverrides, 'path/to/base/file', 'path/to/patch/file', '', 'ISO-8859-1');
```

This will not write an resultant file

```javascript
let tsm = require('@oasp/ts-merger');
let mergedCode: string = tsm.merge(patchOverrides, 'path/to/base/file', 'path/to/patch/file', '', '');
```

This will not write an resultant file and will use UITF-8 as encoding.

## Features

The merger allows merging of this node kinds:

- ImportDeclaration
- ClassDeclaration
- Decorator
- FunctionDeclaration
- MethodDeclaration
- Parameter
- BodyMethod
- PropertyAssignment
- PropertyDeclaration
- Constructor
- ArrayLiteralExpression
- ObjectLiteralExpression
- CallExpression

This version allows merging of TypeScript files that follow this structure:

- Array of imports
- Array of functions
- Array of variables
- Array of classes

##Examples

**Base file**
```javascript
import a from 'b';
import f from 'g';

class Example1 {
    private propertyFromBase: string;

    oneMethod() {
        let variable = 'base';
    }
}
```

**Patch file**

```javascript
import c from 'd';
import h from 'g';

class Example1 {
    private propertyFromPatch: number;

    oneMethod() {
        let variable = 'patch';
    }

    anotherMethod(){}
}
```
**Resultant merged code WITH FALSE PATCHOVERRIDES**

```javascript
import a from 'b';
import c from 'd';
import { f, h } from 'g';

class Example1 {
    private propertyFromBase: string;
    private propertyFromPatch: number;

    oneMethod() {
        let variable = 'base';
    }

    anotherMethod(){}
}
```

**Resultant merged code WITH TRUE PATCHOVERRIDES**

```javascript
import a from 'b';
import c from 'd';
import { f, h } from 'g';

class Example1 {
    private propertyFromBase: string;
    private propertyFromPatch: number;

    oneMethod() {
        let variable = 'patch';
    }

    anotherMethod(){}
}
```

## Future version

Next releases will include merge support for:

- InterfaceDeclaration
