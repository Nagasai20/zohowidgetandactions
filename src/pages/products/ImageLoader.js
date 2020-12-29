import React, { Component } from 'react';
import LoaderGIF from '../../assets/images/loading.gif'

class ImageLoader extends Component {

	render() {
        return (
			<img src='https://i.gifer.com/DzUu.gif' style ={{'width':'50px','display': 'block','margin':'auto'}}/>
		);
    }
};

export default ImageLoader;