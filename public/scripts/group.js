'use strict!';

$('#nateContent').hide();
$('#clariceContent').hide();
$('#jasonContent').hide();
$('#mikeContent').hide();

$('#natePhoto').click(function(){
  $('#nateContent').slideToggle(1000);
  $('#clariceContent').hide(1000);
  $('#jasonContent').hide(1000);
  $('#mikeContent').hide(1000);
});

$('#claricePhoto').click(function(){
  $('#nateContent').hide(1000);
  $('#clariceContent').toggle(1000);
  $('#jasonContent').hide(1000);
  $('#mikeContent').hide(1000);
});

$('#jasonPhoto').click(function() {
  $('#nateContent').hide(1000);
  $('#clariceContent').hide(1000);
  $('#jasonContent').toggle(1000);
  $('#mikeContent').hide(1000);
})

$('#mikePhoto').click(function() {
  $('#nateContent').hide(1000);
  $('#clariceContent').hide(1000);
  $('#jasonContent').hide(1000);
  $('#mikeContent').toggle(1000);
})
