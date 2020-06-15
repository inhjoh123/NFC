import React , {Component} from "react";
import {View, Text, StyleSheet,Button} from "react-native";
import Axios from "axios"; //http 요청을 위해 필요한 모듈

export default class App extends Component {
  state = {};

  constructor(props){ //생성자 메서드
    super(props);
    this.setState({
      output : null,
    });
  }

  _onPress = () => { //
    Axios.get('https://jsonplaceholder.typicode.com/todos/1')//url로 get방식으로 요청
    .then(
        response => {//성공시
        console.log("response : ",response["config"]["validateStatus"]);
        this.setState({output:response}); //get요청의 결과로 받은 데이터를 state에 저장.
      }
    )
    .catch( // 실패시
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
