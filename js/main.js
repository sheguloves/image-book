$(function() {
    var urls = ["images/001.jpg", "images/002.jpg", "images/003.jpg", "images/004.jpg",
                "images/005.jpg", "images/006.jpg", "images/007.jpg", "images/008.jpg"];
    var $mybook = $('#mybook');
    var $bttn_next = $('#next_page_button');
    var $bttn_prev = $('#prev_page_button');
    var $loading = $('#loading');
    var $no_image = $('.no_image');

    var useObjectUrl = false;
    var imagelist = [];

    var length = 0;
    var loaded = 0;

    var loadHandler = function() {
        loaded++;
        if (loaded === length) {
            addBooklet();
            loaded = 0;
        }
    };

    function revokeUrls(urls) {
        if (useObjectUrl) {
            urls.forEach(function(item) {
                window.URL.revokeObjectURL(item);
            });
            useObjectUrl = false;
        }
    }

    var renderImages = function(imagelist) {
        if (imagelist.length > 0) {
            length = imagelist.length;
            $no_image.hide();
            imagelist.forEach(function(item) {
                var $img = $('<img>');
                $img.one('load', loadHandler);
                $img.attr('src', item);
                $mybook.append($img);
            });
            $mybook.children('img').each(function() {
                if (this.complete) {
                    $(this).load();
                }
            });
        } else {
            $no_image.show();
        }
    }

    var addBooklet = function() {
        $loading.hide();
        $bttn_next.show();
        $bttn_prev.show();
        $mybook.show().booklet({
            name: null, // name of the booklet to display in the document title bar
            width: 800, // container width
            height: 500, // container height
            speed: 600, // speed of the transition between pages
            direction: 'LTR', // direction of the overall content organization, default LTR, left to right, can be RTL for languages which read right to left
            startingPage: 0, // index of the first page to be displayed
            easing: 'easeInOutQuad', // easing method for complete transition
            easeIn: 'easeInQuad', // easing method for first half of transition
            easeOut: 'easeOutQuad', // easing method for second half of transition

            pagePadding: 10, // padding for each page wrapper
            pageNumbers: true, // display page numbers on each page

            next: $bttn_next, // selector for element to use as click trigger for next page
            prev: $bttn_prev, // selector for element to use as click trigger for previous page
        });
    }

    var removeBooklet = function() {
        $bttn_next.hide();
        $bttn_prev.hide();
        $mybook.hide().booklet("destroy");
        $mybook.empty();
    }

    var $fileDialog = $('#fileDialog');
    $fileDialog.change(function(event) {
        $loading.show();
        revokeUrls(imagelist);
        removeBooklet();
        var files = event.target.files;
        imagelist = [];
        if (files.length > 0) {
            useObjectUrl = true;
            var imagelist = [];
            var src;
            for (var i = 0; i < files.length; i++) {
                src = window.URL.createObjectURL(files[i]);
                imagelist.push(src);
            }
        }

        renderImages(imagelist);
    });

    renderImages(urls);

});
