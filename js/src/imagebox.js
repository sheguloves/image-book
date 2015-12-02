var ImageItem = React.createClass({
    render: function() {
        return (
            <div className="image_box">
                <img src={this.props.imagesrc}/>
            </div>
        );
    }
});
var ImageList = React.createClass({
    render: function() {
        var list = [];
        this.props.images.forEach(function(item) {
            list.push(<ImageItem imagesrc={item} />);
        });
        return (
            <div className="b-load">
                {list}
            </div>
        );
    }
});

var urls = ["images/001.jpg", "images/002.jpg", "images/003.jpg", "images/004.jpg", "images/005.jpg",
            "images/006.jpg", "images/007.jpg", "images/008.jpg", "images/009.jpg"];

ReactDOM.render(
    <ImageList images={urls} />,
    document.getElementById('mybook')
);