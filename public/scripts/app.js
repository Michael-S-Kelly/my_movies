'use strict'
console.log('app.js is running');

//toggle details
$('.imgCon').on('click', function(event) {
  console.log('pop is running')
  $(this).next().show()

})
$('.pop-details.pop-hide').on('click', function(event) {
  console.log('pop is running')
  $(this).hide()

})

$('.update-movie').on('click', function(event){
  console.log('firing');
  $('.updatemovies').toggleClass('pop-hide')
})
$('.create-review').on('click', function(event){
  console.log('also firing');
  $('.createreview').toggleClass('pop-hide')
})
























let contrakeys =[];
let contra = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";

$(document).keydown(function(element) {
  contrakeys.push(element.originalEvent.key);
  console.log(element.keycode);
  if(contrakeys.toString().indexOf(contra) >= 0) {
    $('.goku-stars').addClass('contra-stars')
    $('.open-sesame').addClass('contra-start')
    $('.goku1').addClass('contra1');
    console.log('contra running');
    $('.goku2').addClass('contra2');
    console.log('contra running');
    $('.goku3').addClass('contra3');
    console.log('contra running');
  }
})