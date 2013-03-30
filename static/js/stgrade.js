var modules = 0;

// Register our jQuery handlers.
$(document).ready(function(){
    $("#start-button").click(animateRemoveText);
    $(window).resize(windowResize);
});

function windowResize() {
    // If the window is resized, make sure we adjust the central div's display
    // properties.
    var new_window_height = $(window).height();
    var content_height = $('.center-window').height();

    if (content_height) {
        if (new_window_height <= content_height) {
            $('.center-window').css({
                position: 'static',
                top: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
            });
        } else if (new_window_height > content_height) {
            $('.center-window').css({
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            });
        }
    }
}

function animateRemoveText() {
    // Fade the text out.
    var $explanation = $(".explanation");
    $explanation.fadeOut(400, function(){
        $explanation.remove();
    });

    // Resize the div.
    $(".center-window").animate({ height: '250px'}, 500, function() {
        animateAddForm();
    });
}

function animateAddForm() {
    // Create the new div for the calculator form.
    $('<div/>', {
        id: "rows",
        "class": "calculator-form"
    }).appendTo(".body");

    // Add a row of buttons to it.
    var row_name = animateAddInputRow(true, false);

    // Finally, add two snazzy new buttons.
    $('<div/>',{
        "class": 'buttons'
    }).appendTo('.body');

    $('<input/>', {
        id: 'new_row_button',
        "class": 'button-1',
        type: 'button',
        name: 'newrow',
        value: 'New Module'
    }).hide().appendTo(".buttons").fadeIn(400).click(function() {
        animateAddInputRow(true, true);
    });

    $('<input/>', {
        id: 'calculate_button',
        "class": 'button-1 button-2',
        type: 'button',
        name: 'calculate',
        value: 'CALCULATE!'
    }).hide().click(calculate).appendTo('.buttons').fadeIn(400);
}

function animateAddInputRow(animate, increase_height) {
    // Increment the modules count.
    modules++;

    var module_id = "module-row" + modules;

    // Add a container div for the row.
    var $new_div = $('<div/>', {
        id: module_id,
        "class": "input-row"
    }).hide().appendTo(".calculator-form");

    // Create the row.
    $('<input/>', {
        type: 'text',
        name: 'grade',
        placeholder: 'Module Grade'
    }).appendTo('#' + module_id);

    $('<input/>', {
        type: 'text',
        name: 'credits',
        placeholder: 'Module Credits'
    }).appendTo('#' + module_id);

    $('<input/>', {
        type: 'button',
        "class": 'button-1 button-close',
        name: 'close',
        value: 'x'
    }).click(function() {
        animateDeleteRow($(this));
    }).appendTo('#' + module_id);

    if (increase_height && animate) {
        $new_div.slideDown(400);
        changeHeightOfCenterWindow(45);
    } else if (animate) {
        $new_div.fadeIn(400);
    } else {
        $new_div.show();
    }
}

function animateDeleteRow(source) {
    source.parent().slideUp(400, function() {
        $(this).remove();
    });
    changeHeightOfCenterWindow(-45);
}

function changeHeightOfCenterWindow(heightChange) {
    var current_height = $('.center-window').height();
    var new_height = current_height + heightChange;
    var cb = function(obj) {};

    // Check whether changing the size of the div will make it go from being
    // smaller than the viewport to larger than the viewport. Also check
    // whether we'll go the other way.
    if (($(window).height() <= new_height) &&
        ($(window).height() > current_height)) {
        // We're going to expand past the viewport. Set a callback to remove
        // some unhelpful CSS.
        cb = function(obj) {
            obj.css({
                position: 'static',
                top: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
            });
        };
    } else if (($(window).height() > new_height) &&
               ($(window).height() <= current_height)) {
        // We're going to shrink past the viewport. Set a callback to remove
        // some unhelpful CSS.
        cb = function(obj) {
            obj.css({
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            });
        };
    }

    $('.center-window').animate({
        height: current_height + heightChange + 'px'
    }, 400, cb($('.center-window')));
}

function calculate() {
    // Multiple stages here. First, go over each row. Confirm that it's got
    // valid data in it. If they all do, then determine the credit-weighted
    // mean and median. Work out what the grade is. Display to screen.
    var $container = $('#rows');
    var credits_and_grades = [];
    var success = true;

    $container.children('div').each(function() {
        var grade = $(this).children('input[name=grade]').val();
        var credits = $(this).children('input[name=credits]').val();

        grade = parseFloat(grade, 10);
        credits = parseInt(credits, 10);

        if (validateRow(grade, credits)) {
            credits_and_grades.push({grade: grade, credits: credits});
            $(this).children('input').removeClass('failed');
        } else {
            success = false;
            $(this).children('input').addClass('failed');
        }
    });

    if (success) {
        displayResult(CWM(credits_and_grades), CWMedian(credits_and_grades));
    }
}

function displayResult(mean, median) {
    var resultString = classificationFromGrades(mean, median);
    var outString = '<p>With a credit-weighted mean of ' +
                    mean.toString() +
                    ' and a credit-weighted median of ' +
                    median.toString() +
                    ', you will graduate with ' +
                    resultString + '.</p>';

    // Add the result text to the body.
    var newDiv = maybeCreateResultsDiv();

    // Clear out any text that might be there, and then add more.
    var $results = $('#results');
    $results.empty();
    $results.append(outString);

    // If the div is new, slide it in and reveal it.
    if (newDiv) {
        $results.slideDown(400);
        changeHeightOfCenterWindow(90);
    }
}

function maybeCreateResultsDiv() {
    var count = $('.body').children('#results');

    if (count.length === 0) {
        return $('<div/>', {
                 "class": 'results',
                 id: 'results'
        }).hide().appendTo('.body');
    } else return null;
}

function validateRow(grade, credits) {
    if (isNaN(grade) || (grade < 0) || (grade > 20) ||
        isNaN(credits) || (credits < 0) || (credits > 120) || !isInt(credits))
    {
        return false;
    }
    else return true;
}

function CWM(grades_and_credits) {
    // Calculate and return a Credit-Weighted Mean.
    var sum = 0;
    var credit_total = 0;

    for (var i = 0; i < grades_and_credits.length; i++)
    {
        sum += (grades_and_credits[i].grade * grades_and_credits[i].credits);
        credit_total += grades_and_credits[i].credits;
    }

    return (sum / credit_total);
}

function CWMedian(grades_and_credits) {
    // Calculate and return a Credit-Weighted Median.
    //
    // This notion requires more explanation. A credit-weighted median arranges the
    // modules in order of grade, and then counts up to the halfway point of the
    // *credits*. For example, if you've taken 120 credits of modules, arrange them
    // in grade order and then count up 60.5 credits. This value is the credit-weighted
    // median.

    // Begin by sorting the array.
    grades_and_credits.sort(function(a, b){return (a.grade - b.grade);});

    // Calculate the number of credits taken.
    var credits = 0;

    for (var i = 0; i < grades_and_credits.length; i++)
    {
        credits += grades_and_credits[i].credits;
    }

    // The middle credit number is (credit_total + 1)/2.
    var credit_total = (credits + 1)/2;

    if (isInt(credit_total))
    {
        // If the credit total is an integer, return the grade of the module that integer
        // falls in.
        credits = 0;
        for (i = 0; i < grades_and_credits.length; i++)
        {
            credits += grades_and_credits[i].credits;

            if (credits >= credit_total) return grades_and_credits[i].grade;
        }
    }
    else
    {
        // Trickier. 9 times out of 10 the half point will fall in a module, but it might
        // fall between modules. We need to check for that edge case.
        credits = 0;

        for (i = 0; i < grades_and_credits.length; i++)
        {
            credits += grades_and_credits[i].credits;

            // This has fallen between modules.
            if (((credit_total - 0.5) == credits) && ((credit_total + 0.5) > credits))
            {
                return ((grades_and_credits[i+1].grade + grades_and_credits[i].grade)/2);
            }
            else if (credits > credit_total)
            {
                return grades_and_credits[i].grade;
            }
        }
    }
}

function isInt(num) {
    if((parseFloat(num) == parseInt(num, 10)) && !isNaN(num))
    {
        return true;
    } else return false;
}

function classificationFromGrades(mean, median) {
    // This grade classification is drawn from the University of St Andrews
    // website.
    if (mean >= 16.5) return 'First Class Honours';
    else if ((mean >= 16) && (median >= 16.5)) return 'First Class Honours';
    else if (mean >= 13.5) return 'Upper Second Class Honours (II.1)';
    else if ((mean >= 13) && (median >= 13.5)) return 'Upper Second Class Honours (II.1)';
    else if (mean >= 10.5) return 'Lower Second Class Honours (II.2)';
    else if ((mean >= 10) && (median >= 10.5)) return 'Lower Second Class Honours (II.2)';
    else if (mean >= 7.5) return 'Third Class Honours';
    else if ((mean >= 7) && (median >= 7.5)) return 'Third Class Honours';
    else return 'a degree "Not of Honours Standard"';
}
