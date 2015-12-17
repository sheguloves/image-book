$(function() {
    // add check scrollbar function
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };

    var urls = ["app/styles/images/001.jpg", "app/styles/images/002.jpg", "app/styles/images/003.jpg", "app/styles/images/004.jpg",
                "app/styles/images/005.jpg", "app/styles/images/006.jpg", "app/styles/images/007.jpg", "app/styles/images/008.jpg",
                "app/styles/images/001.jpg", "app/styles/images/002.jpg", "app/styles/images/003.jpg", "app/styles/images/004.jpg",
                "app/styles/images/005.jpg", "app/styles/images/006.jpg", "app/styles/images/007.jpg", "app/styles/images/008.jpg"];
    var $mybook = $('#mybook');
    var $bttn_next = $('#next');
    var $bttn_prev = $('#prev');
    var $loading = $('.loading');
    var $gallery = $('.gallery');

    $('#scroll-next')
    .click(function(event) {
        if (!$gallery.hasScrollBar()) {
            return;
        }
        var size = getSize();
        movement = $gallery.scrollLeft() + size.itemwidth;
        galleryScroll();
    });
    $('#scroll-prev')
    .click(function(event) {
        if (!$gallery.hasScrollBar()) {
            return;
        }
        var size = getSize();
        movement = $gallery.scrollLeft() - size.itemwidth;
        galleryScroll();
    });

    var mouseEnter = false;
    var pendding = false;
    var movement = 0;

    $gallery
    .mouseenter(function(event) {
        mouseEnter = true;
    })
    .mouseleave(function(event) {
        mouseEnter = false;
        if (pendding) {
            // scroll gallery after hover animation finish
            setTimeout(galleryScroll, 500);
        }
    });


    var useObjectUrl = false;
    var imagelist = [];

    var length = 0;
    var loaded = 0;

    function loadHandler(event) {
        loaded++;
        if (loaded === length) {
            addBooklet();
            var temp = $('img');
            buildGallery(temp);
            loaded = 0;
        }
    }

    function getSize() {
        if (window.matchMedia("(min-width: 1200px)").matches) {
            return {
                width: 980,
                height: 700,
                itemwidth: 105
            };
        } else {
            return {
                width: 980,
                height: 700,
                itemwidth: 105
            }
        }
    }

    function buildGallery(pages) {
        var page;
        var $pages = $('<ul>');
        for (var i = 0; i < pages.length; i ++) {
            var className = (i % 2) === 0 ? "left-page" : "right-page";
            page = $(pages[i]).clone();
            $('<li>').append(
                $('<div>')
                .addClass('galleryItem')
                .addClass(className)
                .data('index', i)
                .append(page)
                .append($('<div>').addClass('g-counter').text(i + 1))
                .click(function(event) {
                    $mybook.booklet("gotopage", $(event.currentTarget).data('index'));
                })
            ).appendTo($pages);
        }
        $pages.appendTo($gallery);
    }

    function revokeUrls(urls) {
        if (useObjectUrl) {
            urls.forEach(function(item) {
                window.URL.revokeObjectURL(item);
            });
            useObjectUrl = false;
        }
    }

    function renderImages(imagelist) {
        if (imagelist.length > 0) {
            length = imagelist.length;
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
        }
    }

    function addBooklet() {
        $loading.hide();
        $bttn_next.show();
        $bttn_prev.show();
        var size = getSize();
        $mybook.show().booklet({
            name: null, // name of the booklet to display in the document title bar
            width: size.width, // container width
            height: size.height, // container height
            speed: 300, // speed of the transition between pages
            direction: 'LTR', // direction of the overall content organization, default LTR, left to right, can be RTL for languages which read right to left
            startingPage: 0, // index of the first page to be displayed
            easing: 'easeInOutQuad', // easing method for complete transition
            easeIn: 'easeInQuad', // easing method for first half of transition
            easeOut: 'easeOutQuad', // easing method for second half of transition

            pagePadding: 0, // padding for each page wrapper
            pageNumbers: true, // display page numbers on each page

            next: $bttn_next, // selector for element to use as click trigger for next page
            prev: $bttn_prev, // selector for element to use as click trigger for previous page
            change: bookletChangeHandler
        });
    }

    function bookletChangeHandler(event, data) {
        if (!$gallery.hasScrollBar()) {
            return;
        }
        var size = getSize();
        var index = data.index + 1;
        movement = index * size.itemwidth - (size.width / 2)
        if (mouseEnter) {
            pendding = true;
        } else {
            galleryScroll();
        }
    }

    function galleryScroll() {
        pendding = false;
        $gallery.scrollLeft(movement);
        movement = 0;
    }

    function removeBooklet() {
        $bttn_next.hide();
        $bttn_prev.hide();
        $mybook.hide().booklet("destroy");
        $mybook.empty();
    }

    function removeGallery() {
        $gallery.empty();
    }

    var $fileDialog = $('#fileDialog');
    $fileDialog.change(function(event) {
        $loading.show();
        revokeUrls(imagelist);
        removeBooklet();
        removeGallery();
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
