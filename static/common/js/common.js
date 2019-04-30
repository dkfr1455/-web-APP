//导航条事件
$(".arrows_inf").mouseenter(function (){
	$(this).children('ol').css('display', 'block');
})
$(".arrows_inf").mouseleave(function (){
	$(this).children('ol').css('display', 'none');
})
$(".arrows_inf li").mouseenter(function (){
	$(this).children('.drop_box').css('display', 'block');
})
$(".arrows_inf li").mouseleave(function (){
	$(this).children('.drop_box').css('display', 'none');
})
$(".notice").mouseenter(function (){
	$(this).children('.drop_box').css('display', 'block');
})
$(".notice").mouseleave(function (){
	$(this).children('.drop_box').css('display', 'none');
})
$(".header_bd_r li").mouseenter(function (){
	$(this).children('a').addClass('active');
	$(this).siblings().children('a').removeClass('active');
})
$(".header_bd_r li").mouseleave(function (){
	$(this).children('a').removeClass('active');
	$(".header_bd_r .regiter_link").addClass('active');
})