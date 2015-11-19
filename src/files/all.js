$(document).ready(function(){	
		
	// fancybox
	$('.fancybox').fancybox();	
	// checkbox
	$(".checkbox").uniform();
	$('form').each(function(){
		$(this).validate();
	});	
	
		// header like	
		$(document).on('click','.article-more',function(e){
			e.preventDefault();
			if($(this).hasClass('article-vis')){
				$('.article-hidden').slideUp();
				$(this).removeClass('article-vis');
				$(this).children().text('Показать полностью');
			}else{
				$('.article-hidden').slideDown();
				$(this).addClass('article-vis');
				$(this).children().text('Свернуть');
			}
		});
		// header like	
		$(document).on('click','.nav-icon',function(e){
			e.preventDefault();
			if($(this).hasClass('nav-vis')){
				$('.hidden-fix-nav').hide();
				$(this).removeClass('nav-vis');
			}else{
				$('.hidden-fix-nav').show();
				$(this).addClass('nav-vis');
			}
		});
	
	// timer
	$('#countdown').timeTo({
		seconds: 252500,
		fontSize: 16,
		fontFamily: 'Fira Sans',
		displayDays: 2
	});	
	$('#countdown1').timeTo({
		timeTo: new Date(new Date('Thu Nov 26 2015 09:00:00 GMT+0200 (Финляндия (зима))')),
		fontSize: 16,
		fontFamily: 'Fira Sans',
		displayDays: 2
	});	
	$('#countdown2').timeTo({
		seconds: 252500,
		fontSize: 16,
		fontFamily: 'Fira Sans',
		displayDays: 2
	});	
		
	
	
});	

