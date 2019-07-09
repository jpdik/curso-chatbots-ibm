$(function () {
    $(".button.close").click(function () {
        $(".chat_window").animate({
            opacity: 0,
            height: "60"
        }, 600,function(){
            console.log("ok");
            $(".chat_window").hide();
        });
    });

    $(".top_menu").click(function () {
        let size = $(".chat_window").height();
        if (size == 500) {
            $(".chat_window").animate({
                opacity: .4,
                height: "60"
            });
        }
        else
            $(".chat_window").animate({
                opacity: 1,
                height: "500"
            });
    });

    $(".button.minimize").click(function () {
        $(".chat_window").animate({
            opacity: .4,
            height: "60"
        });
    });

    $(".button.maximize").click(function () {
        $(".chat_window").animate({
            opacity: 1,
            height: "500"
        });
    });
});
