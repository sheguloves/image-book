var urls = ["app/styles/images/001.jpg", "app/styles/images/002.jpg", "app/styles/images/003.jpg", "app/styles/images/004.jpg",
            "app/styles/images/005.jpg", "app/styles/images/006.jpg", "app/styles/images/007.jpg", "app/styles/images/008.jpg"];

var Book = React.createClass({
    removeBooklet: function() {
        var $mybook = $('#mybook');
        $mybook.booklet("destroy");
    },
    addBooklet: function() {
        var $loading = $('#loading');
        var $bttn_next = $('#next_page_button');
        var $bttn_prev = $('#prev_page_button');
        var $mybook = $('#mybook');
        $loading.hide();
        $bttn_next.show();
        $bttn_prev.show();
        $mybook.show().booklet({
            width: 800, // container width
            height: 500, // container height
            speed: 300, // speed of the transition between pages
            startingPage: 0, // index of the first page to be displayed

            closed: false,   // start with the book "closed", will add empty pages to beginning and end of book

            pagePadding: 10, // padding for each page wrapper
            pageNumbers: true, // display page numbers on each page

            keyboard: true, // enables navigation with arrow keys (left: previous, right: next)
            next: $bttn_next, // selector for element to use as click trigger for next page
            prev: $bttn_prev, // selector for element to use as click trigger for previous page

            shadows: false, // display shadows on page animations
        });
    },
    componentWillUnmount: function() {
        // remove previous booklet before new images loading
        this.removeBooklet();
        var $loading = $('#loading');
        var $bttn_next = $('#next_page_button');
        var $bttn_prev = $('#prev_page_button');
        var $mybook = $('#mybook');
        $loading.show();
        $bttn_next.hide();
        $bttn_prev.hide();
        $mybook.hide();
    },
    componentDidUpdate: function() {
        // add booklet immediately after new images loading
        this.addBooklet();
    },
    componentDidMount: function() {
        // add booklet immediately after initial images loading
        this.addBooklet();
    },
    render: function() {
        var temp;
        var images = this.props.images
        if (images && images.length > 0) {
            temp = [];
            images.forEach(function(item) {
                temp.push(<ImageItem key={item} imagesrc={item} />);
            });
        } else {
            temp = <div> No image selected </div>
        }
        return (
            <div className="book_wrapper">
                <a id="next_page_button"></a>
                <a id="prev_page_button"></a>
                <div id="loading" className="loading">Loading pages...</div>
                <div id="mybook" style={{display: 'none'}}>
                    {temp}
                </div>
            </div>
        );
    }
});

var ImageItem = React.createClass({
    loadHandler: function() {
        window.URL.revokeObjectURL(this.src);
    },
    render: function() {
        return (
            <div className="image_box">
                <img src={this.props.imagesrc} onLoad={this.loadHandler}/>
            </div>
        );
    }
});

var Files = React.createClass({
    handleFiles: function(event) {
        var files = event.target.files;
        if (files.length === 0) {
            return null;
        } else {
            var imagelist = [];
            var src;
            for (var i = 0; i < files.length; i++) {
                src = window.URL.createObjectURL(files[i]);
                imagelist.push(src);
            }
            this.props.onImageLoaded(imagelist);
        }
    },
    render: function() {
        return (
            <footer>
                <input id="fileDialog" type="file" multiple onChange={this.handleFiles} accept="image/*" style={{display:'none'}}/>
                <label style={{cursor: 'pointer'}} htmlFor="fileDialog" className="open-button">Select Files</label>
            </footer>
        )
    }
});

var Booker = React.createClass({
    getInitialState: function() {
        return {
            images: urls
        };
    },
    handleImageLoaded: function(imageslist) {
        this.setState({images: imageslist});
    },
    render: function() {
        return (
            <div>
                <Book images={this.state.images} />
                <Files onImageLoaded={this.handleImageLoaded} />
            </div>
        );
    }
});

ReactDOM.render(
    <Booker />,
    document.getElementById('booker')
);