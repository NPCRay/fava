import test from "ava";
import { fuzzyfilter, fuzzytest, fuzzywrap } from "../javascript/lib/fuzzy";

test("fuzzy test", (t) => {
  t.assert(fuzzytest("asdf", "asdfasdf"));
  t.assert(fuzzytest("asdf", "ASDFASDF"));
  // "smart-case" matching
  t.assert(fuzzytest("Asdf", "ASDFASDF") < fuzzytest("asdf", "ASDFASDF"));
  t.assert(fuzzytest("ASDF", "ASDFASDF") === fuzzytest("asdf", "ASDFASDF"));

  t.assert(!fuzzytest("Asdf", "asdfasdf"));
  t.assert(fuzzytest("asdf", "a;lks;lk;lkd;lk;flkj;l"));
  t.assert(!fuzzytest("asdf", "sdfsdf"));
  t.assert(!fuzzytest("a", "sdfsdf"));
});

test("fuzzy filter", (t) => {
  t.deepEqual(fuzzyfilter("", ["asdfasdf", "a"]), ["asdfasdf", "a"]);
  t.deepEqual(fuzzyfilter("asdf", ["asdfasdf", "nomatch"]), ["asdfasdf"]);
  t.deepEqual(fuzzyfilter("asdf", ["assdfsdf", "asdfasdf", "nomatch"]), [
    "asdfasdf",
    "assdfsdf",
  ]);
  t.deepEqual(
    fuzzyfilter("asdf", [
      "test",
      "asdfasdf",
      "asdxf",
      "asxxdf",
      "nomatch",
      "asdf",
    ]),
    ["asdfasdf", "asdf", "asdxf", "asxxdf"]
  );
});

test("fuzzy wap", (t) => {
  t.deepEqual(fuzzywrap("", "tenotest"), "tenotest");
  t.deepEqual(fuzzywrap("test", "tenotest"), "teno<span>test</span>");
  t.deepEqual(fuzzywrap("sdf", "nomatch"), "nomatch");
  t.deepEqual(fuzzywrap("test", "tetest"), "te<span>test</span>");
  t.deepEqual(fuzzywrap("test", "teTEST"), "te<span>TEST</span>");
  t.deepEqual(fuzzywrap("a", "asdfasdf"), "<span>a</span>sdfasdf");
  t.deepEqual(fuzzywrap("as", "asdfasdf"), "<span>as</span>dfasdf");
  t.deepEqual(fuzzywrap("as", "as"), "<span>as</span>");
});
