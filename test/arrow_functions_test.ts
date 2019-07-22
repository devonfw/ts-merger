import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('should merge expression statements', () => {
  const base = `describe('SidenavSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [
        RouterTestingModule,
        CoreModule,
      ],
    });
  });`,
    patch = `describe('arg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [
        patchImport,
      ],
    });
  });`;
  it('including arrow functions.', () => {
    const result: String[] = merge(base, patch, false)
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value != '');
    expect(
      result.filter((res) =>
        /describe\.\('SidenavSharedService',\s*\(\)\s*=>\s*{/.test(
          res.toString(),
        ),
      ),
    ).length.to.be.greaterThan(
      0,
      'base should have its two parameters untouched',
    );
    expect(
      result.filter((res) => /patchImport/.test(res.toString())),
    ).length.to.be.greaterThan(0, 'should have merged patch import too');
    expect(
      result.filter((res) => /},\s*'arg',\s*\);/.test(res.toString())),
    ).length.to.be.greaterThan(0, 'should have merged patch argument too');
  });
});
