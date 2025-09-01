/*------------------------------------- Preloader -------------------------------------*/
$(window).on("load", function() {
	$('.preloader').delay(1000).fadeOut(800); 
});

/*------------------------------------- Slider -------------------------------------*/
$('.blog-bottom-sec').slick({
  dots: false,
  arrows: false,
  infinite:false,
  autoplay:true,
  variableWidth: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1
});

$('.product-bottom-sec').slick({
  dots: false,
  arrows: false,
  infinite:false,
  autoplay:true,
  speed: 300,
  slidesToShow: 1.5,
  slidesToScroll: 1,
   responsive: [
  {
    breakpoint: 320,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }
  ]
});

$('.gallery-bottom').slick({
  dots: false,
  arrows: false,
  infinite:false,
  autoplay:true,
  speed: 300,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
  {
    breakpoint: 320,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }
  ]
});