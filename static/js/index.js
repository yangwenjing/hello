//生成颜色
function randomColor() {
    return '#' + Math.random().toString(16).slice(2, 8);
}

//高度
$(window).resize(function() {
    $('section').height($(window).height() - 285);
})

//交互
$(document).ready(function() {
    $('section').height($(window).height() - 450);
    $('article').each(function() {
        $(this).css('background-color', randomColor());
        $(this).hover(function() {
            $(this).find('a').toggleClass('transparent');
        });
        $(this).click(function() {
            window.open($(this).find('a').attr('href'));
        });
        $(this).mouseover(function() {
            var weight = 3 || $('article').length - 1;
            $(this).css('flex', weight  + ' ' + weight);
            $(this).find('.info').show();
        });
        $(this).mouseout(function() {
            $(this).css('flex', 1 + ' ' + 1);
            $(this).find('.info').hide();
        });
    });
    $('header').css('background-color', randomColor());
});
