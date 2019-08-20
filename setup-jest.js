const should = require('should')
const td = require('testdouble')
global.should = should
global.td = td
require('testdouble-jest')(td, jest)
