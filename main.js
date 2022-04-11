/*
  TASK 1: Sortable Tables
  derived from this YouTube tutorial: https://www.youtube.com/watch?v=QxbJ9b-mpoA&t=365s
*/
$(document).ready(function() { //allows us to place the script tag for this file in the head part of our HTML file

  //sorts dynamic table shown in the web browser
  th1 = document.querySelectorAll('#thead th');
  //loops through all elelments in the table header to add click event listener
  for (let c = 0; c < th1.length; c++) {
    if(c != 2) {
      th1[c].addEventListener('click', function() {
        console.log(c); //outputs to console which index of the table header is being selected
        sortTable1(c,'tableBody'); //call function below
      })
      th1[c].style.cursor = "pointer";
    }
  }
  
  //sorts static table shown in the browser
  th2 = document.querySelectorAll('#thead1 th');

  //loops through all elelments in the table header to add click event listener
  for (let c = 0; c < th2.length; c++) {
    if (c != 1) {
      th2[c].addEventListener('click', function() {
        console.log(c); //outputs to console which index of the table header is being selected
        sortTable1(c, 'tableBody1'); //call function below
      });
      th2[c].style.cursor = "pointer"; 
    }
  }

  //sorting function
  function sortTable1(c, tableID) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById(tableID); //only loops through our tbody tag
    switching = true;

    //Make a loop that will continue until no switching has been done:
    while (switching) {
      switching = false; //initial value of no switching (or false)
      rows = table.rows;
      
      //loops through all the rows in the tbody
      for (i = 0; i < (rows.length - 1); i++) {
        shouldSwitch = false;
      
        //comparing elemenets in the TDs
        x = rows[i].getElementsByTagName("TD")[c];
        y = rows[i + 1].getElementsByTagName("TD")[c];
        
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      //If a switch has been marked, make the switch and mark that a switch has been done:
      if (shouldSwitch) { 
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
});

/* 
  function used in TASK 2 & 3 to dynamically add the rows to the table
*/
function addToTable() {
  $("#tableBody tr").remove(); //removes all table rows from the bestSeller table body
  $.get("https://wt.ops.labs.vu.nl/api22/b442b635", function(data) {
    //appends all items to the bottom of the table
    for(let d = 0; d < (data.length); d++) {
      $("#tableBody").append("<tr><td>" + data[d].brand + "</td><td>" + data[d].model + "</td><td> <img src='" + data[d].image + "'>" + 
      "</td><td>" + data[d].os + "</td><td>" + data[d].screensize + "</td></tr>"); 
    }
  }) 
}

/*
  TASK 2: Reset button
*/
$(document).ready(function() {
  let $resetButton = $('.bestSeller');
  //adds button for the reset without touching HTML
  $resetButton.append("<br/><input type='submit' id='resetButton' value='Reset'></input>");

  $("#resetButton").click(function() {
    $.get("https://wt.ops.labs.vu.nl/api22/b442b635/reset",addToTable); 
    $("#formSubmit")[0].reset();
  });
});

/*
  TASK 3: Dynamic Table
*/
$(document).ready(function() {
  window.addEventListener('load', addToTable); //event listener that adds items from database onto table after window has loaded
});

/*
  TASK 4: Post responses to API
*/
$(document).ready(function() {
  $("#formSubmit").on('submit', function(event){
    event.preventDefault(); //prevents the form going to the URI success page
    var vals = $(this).serialize(); //makes sure data is in json
    $.ajax ({
      url: "https://wt.ops.labs.vu.nl/api22/b442b635",
      method: "POST",
      data: vals,
      dataType: "json"
    })
    .done(function(data) {
      console.log('success');
      addToTable();
      $("#formSubmit")[0].reset(); //empties input fields after form has submitted
    })
  });
});