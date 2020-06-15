1. REST 서버와 React Native 어플간 통신
: https://velog.io/@johnque/React-API-%EC%97%B0%EB%8F%99-v9k692txn5


2. flask REST서버 구축
: https://medium.com/@feedbotstar/python-flask-%EB%A1%9C-%EA%B0%84%EB%8B%A8%ED%95%9C-rest-api-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0-60a29a9ebd8c

3. python 가상환경 설정(virtualenv, venv, conda...) 
: 각각의 가상환경 관리 패키지를 사용하는 건 좋은데, 반드시 사용하고 deactivate를 해줘야한다.
(패키지별로 방법은 다름)

- virtualenv : https://dgkim5360.tistory.com/entry/python-virtualenv-on-linux-ubuntu-and-windows
- venv : http://blog.naver.com/PostView.nhn?blogId=gracehappyworld&logNo=221490620526&parentCategoryNo=&categoryNo=17&viewDate=&isShowPopularPosts=true&from=search
- conda : 



4. 파이썬 -> 기본적으로 인터프리터 언어기 때문에,
	     한번에 하나의 싱글쓰레드 작업만 지원.

	    멀티쓰레드나 멀티프로세싱을 하려면 별도의 모듈을 import 해야 한다.

	    멀티쓰레드는 threading(high 레벨), thread(이제 안쓰는 추세.low레벨)

            모듈로 사용은 가능하여 비동기 프로그래밍에 사용 가능하지만,

	    GIL 룰로 인해서 CPU 계산작업중엔 한번에 하나의 쓰레드만 자원에 접근가능하다.

	    그러므로 병렬연산이 아닌, 직렬연산과 다를게 없이 동작한다.

	   그러므로 병렬 연산을 수행해야 하는 경우, 
 
  	    여러개의 cpu를 사용가능한 멀티 프로레싱 을 사용해야한다.

	   사용법은 threading과 차이가 거의 없다.

	    이러한 병렬처리보단 비동기처리방식이 대세이다.

	사용법은 modern js와 동일

	async로 함수를 선언, 비동기로 값을 대기해야하는 코드앞에 await.




nodejs : 
	nodejs의 node는 v8엔진 == 자바스크립트엔진 == 자바스크립트 인터프리터

	자바스크립트는 싱글쓰레드만 지원. 어떤모듈을 추

	가하던지 멀티쓰레드(멀티 프로세스 포함) 사용이 불가.

	i/o 다중처리를 위한 유일한 방법은 비동기처리 만 가능하다.

	특정 코드를 콜백메서드,프로미스 객체, setTimer, setInterrupt 등의

	방식을 사용하면 비동기 큐에 특정작업처리가 등록되고, 원하는 값이

	도달 한 이후에 이벤트루프에서 특정 작업이 실행된다.

	async나 await은 위의 방법에 대한 문법적인 포장일 뿐이다.

	이러한 방식으로 비동기 처리가 가능하지만,

	결정적으로 이벤트루프 조차도 싱글쓰레드로 돌아간다.

	그러므로 연산이 복잡한 작업이 비동기큐에 쌓이면

	병목현상이 이벤트루프상에서 발생한다.

	그러므로 비동기 처리는 간단한 연산수행을 목표로 해야한다.

	그러므로 NODE를 사용하여 서버를 구현한다면,

	1. 대용량 데이터를 통신하는 방식

	2. 복잡한 연산을 비동기처리로 해야하는경우

	이두가지는 피해야한다.
	
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
