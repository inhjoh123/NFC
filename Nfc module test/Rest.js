import React , {Component} from "react";
import {View, Text, StyleSheet,Button} from "react-native";
import Axios from "axios";

export default class App extends Component {
  state = {};

  constructor(props){
    super(props);
    this.setState({
      output : null,
    });
  }

  _onPress = () => {
    Axios.get('https://jsonplaceholder.typicode.com/todos/1')//url로 get방식으로 요청
    .then(
        response => {//성공시
        console.log("response : ",response["config"]["validateStatus"]);
        this.setState({output:response});
      }
    )
    .catch(
      error =>{
        console.log("error : ",error);
      }
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <Button title="btn" onPress={this._onPress}/>
        <Text>output:</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:"#333300",
  },
});

/* post 방식 요청.
axios.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone'
})
.then(function (response) {
  console.log(response);
})
.catch(function (error) {
  console.log(error);
});
*/