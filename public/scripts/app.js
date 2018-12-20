'use strict'
console.log('app.js is running');

//========================Basic Element Declarations=================================
//------------Elements that will be common between page views------------------------
// const bodyEl = $('#bodyStuff');
// //------------Main Header Elements (Consistant Regardles of View)--------------------
// const headerEl = $(document.createElement('header'));
// //------------Main-Title Elements (Consistant Regardles of View)---------------------
// const mainTitleEl = $(document.createElement('div')).prop('id', 'mainTitle');
// const movieEl = $(document.createElement('h1').radius(384));
// const nightEl = $(document.createElement('h2'));
// const navEl = $(document.createElement('div')); //==Hamburger Menu to Navigate Views=
// const logoEl = $(document.createElement('img'));
// //------------Sub-Title Element (Changes to Match the Page View)---------------------
// const subTitleEl = $(document.createElement('div')).prop('id', 'subTitle');
// //------------Main Element (Changes to Match the Page View)--------------------------
// const mainEl = $(document.createElement('main')).prop('id', 'mainStuff');
// //------------Footer Element (Consistant Regardles of View)--------------------------
// const footerEl = $(document.createElement('footer'));
//===================================================================================

//=======================Assign Element ID (Used to Get ID in Future Functions)======

//===================================================================================

//=======================Set Up Main Header==========================================

//===================================================================================

//=======================Basic Element Relationships=================================
// bodyEl.appendChild(headerEl);
// bodyEl.appendChild(mainEl);
// bodyEl.appendChild(footerEl);

// headerEl.appendChild(mainTitleEl);
// headerEl.appendChild(subTitleEl);

// mainTitleEl.appendChild(movieEl);
// mainTitleEl.appendChild(nightEl);
// mainTitleEl.appendChild(navEl);
// mainTitleEl.appendChild(logoEl);
//===================================================================================


// trigger ///

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
