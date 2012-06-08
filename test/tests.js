// This file contains the tests for the Javascript on this webpage.
// The tests focus on mathematical functionality, not the DOM editing.
var module1 = new Object();
var module2 = new Object();
var module3 = new Object();
var module4 = new Object();
module1.grade = 10;
module1.credits = 15;
module2.grade = 15;
module2.credits = 15;
module3.grade = 7.5;
module3.credits = 10;
module4.grade = 18;
module4.credits = 30;
var modules = [module1, module2, module3, module4];

test('validateRow(grade,credits)', function() {
    ok(validateRow(10,10), 'Accepts legitimate values.');
    ok(validateRow(10.5,10), 'Accepts decimal-valued grades.');
    ok(!validateRow(21,10), "Grades above 20 aren't valid.");
    ok(!validateRow(-1, 10), "Grades below 0 aren't valid.");
    ok(!validateRow(10,-1), "Credits below 0 aren't valid.");
    ok(!validateRow('kafka', 10), "Non-numeric grades aren't valid.");
    ok(!validateRow(10, 'kafka'), "Non-numeric credits aren't valid.");
    ok(!validateRow(10,7.5), "Non-integer credit weights aren't valid.");
});

test('CWM(grades_and_credits)', function() {
    ok(CWM(modules), 'Provides any output for correct kind of input.');
    equal(CWM(modules), 14.142857142857142, 'Provides correct mean of valid input data.');
});

test ('CWMedian(grades_and_credits', function() {
    // Do some preparatory work.
    var module5 = new Object();
    module5.grade = 18.5;
    module5.credits = 1;
    var modules2 = modules.concat([module5]);
    var module6 = new Object();
    module6.grade = 19;
    module6.credits = 8;
    var modules3 = modules.concat([module5, module6]);
    var module7 = new Object();
    module7.grade = 19.5;
    module7.credits = 2;
    var modules4 = modules.concat([module5, module6, module7]);
    var module8 = new Object();
    module8.grade = 19.5;
    module8.credits = 1;
    var modules5 = modules.concat([module5, module6, module8]);
    var module9 = new Object();
    module9.grade = 19.5;
    module9.credits = 0.5;
    
    // Start testing.
    equal(CWMedian(modules), 15, 'Correct value when median is half integral and inside a module.');
    equal(CWMedian(modules2), 15, 'Correct value when median is integral and inside a module.');
    equal(CWMedian(modules3), 15, 'Correct value when median is integral at the end of a module.');
    equal(CWMedian(modules4), 18, 'Correct value when median is integral at the start of a module.');
    equal(CWMedian(modules5), 16.5, 'Correct value when median is half integral and between two modules.');
});

test ('isInt(num)', function() {
    ok(isInt(5), 'Handles integer values correctly.');
    ok(!isInt(5.5), 'Handles decimal values correctly.');
    ok(isInt(-5), 'Handles negative integer values correctly.');
    ok(!isInt(-5.5), 'Handles negative decimal values correctly.');
});