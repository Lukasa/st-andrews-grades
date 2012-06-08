var modules = 0;

function addNewRowOfControls(formID) {
    var newrow = document.createElement('div');
    modules++;
    newrow.id = 'module-row' + modules;
    newrow.className = 'input-row';
    newrow.innerHTML = '<input type="text" name="grade" placeholder="Module Grade">'     +
                       '<input type="text" name="credits" placeholder="Module Credits">' +
                       '<input type="button" class="button-1 button-close" name="close" value="&times;" onClick="removeRow(\'' + newrow.id + '\', \'' + formID + '\')">';
    document.getElementById(formID).appendChild(newrow);
}

function removeRow(childID, parentID) {
    var child = document.getElementById(childID);
    var parent = document.getElementById(parentID);
    parent.removeChild(child);
}

function validateRow(grade, credits) {
    if (isNaN(grade) || (grade < 0) || (grade > 20) ||
        isNaN(credits) || (credits < 0) || (credits > 120) || !isInt(credits))
    {
        return false;
    }
    else return true; 
}

function updateRowData(rowID, color) {
    var controls = document.getElementById(rowID).getElementsByTagName('input');
    
    for (var i = 0; i < controls.length; i++) {
        if (controls[i].name != 'close'){
            controls[i].style.background = color;
        }
    }
}

function updateRowValidData(rowID) {
    updateRowData(rowID, 'white');
}

function updateRowInvalidData(rowID) {
    updateRowData(rowID, 'red');
}

function getGradesAndCredits(rows) {
    var results = new Array();
    var valid_counter = 0;
    
    for (var i = 0; i < rows.length; i++)
    {
        if (rows[i].nodeName == '#text') continue;
        var data = new Object();
        var row = rows[i].getElementsByTagName('input');
        data.grade = parseFloat(row[0].value, 10);
        data.credits = parseFloat(row[1].value, 10);
        data.id = rows[i].id;
        results[valid_counter] = data;
        valid_counter++;
    }
    
    return results;
}

function validateForm(form) {
    if (form.hasChildNodes())
    {
        // Should be a list of divs.
        var children = form.childNodes;
        var valid = true;
        
        var grades_and_credits = getGradesAndCredits(children);
        
        for (var i = 0; i < grades_and_credits.length; i++)
        {
            if (!validateRow(grades_and_credits[i].grade, grades_and_credits[i].credits))
            {
                valid = false;
                updateRowInvalidData(grades_and_credits[i].id);
            }
            else
            {
                updateRowValidData(grades_and_credits[i].id);
            }
        }
        
        if (valid) return true;
        else return false;
    }
    else
    {
        return false;
    }
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
    grades_and_credits.sort(function(a, b){return (a.grade - b.grade)});
    
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
        for (var i = 0; i < grades_and_credits.length; i++)
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
        
        for (var i = 0; i < grades_and_credits.length; i++)
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
    if((parseFloat(num) == parseInt(num)) && !isNaN(num))
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

function processForm(formID) {
    var form = document.getElementById(formID);
    var valid = validateForm(form);
    
    if (valid)
    {
        var grades_and_credits = getGradesAndCredits(form.childNodes);
        var mean = CWM(grades_and_credits);
        var median = CWMedian(grades_and_credits);
        var degree_class = classificationFromGrades(mean, median);
        var results_div = document.getElementById('result');
        results_div.innerHTML = '<h3>Result</h3>' +
                                '<p>Your Credit-Weighted Mean is ' + mean.toFixed(2) +
                                ', and your Credit-Weighted Median is ' + median.toFixed(2) +
                                '. </br> This means you will graduate with ' + degree_class +
                                '.';
        results_div.style.visibility = 'visible';
    }
}