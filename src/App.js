import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation'
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';



import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const app = new Clarifai.App({
  apiKey: 'e4bf2afc1005461bb9ac236e8e0fab43' 
})

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {

      }
    }
  }
  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow:  clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow:  height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    console.log(box);
    this.setState({ box });
  }

  onInputChange = event => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input
    )
    .then(res => this.displayFaceBox(this.calculateFaceLocation(res)))  
    .catch( err => console.log(err));
  }

  
  
  render() {
    return (
      <div className="App">
        <Particles 
          params={particlesOptions} 
          className="particles" 
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onSubmit} />
        <FaceRecognition
          imageUrl={this.state.imageUrl}
          box={this.state.box}
        /> 
      </div>
    );
  }
}

export default App;
