# Ndef 테스트 앱
필요한 모듈들을 import 한다.
```javascript
import React, {Component} from "react";
import {View, Text, StyleSheet, StatusBar,TouchableOpacity} from "react-native";
import NfcManager, {Ndef, NfcEvents, ByteParser} from "react-native-nfc-manager";
```

디폴트로 export될 클래스 이다. 이 모듈을 index.js에서 import하여
앱을 실행하는 것이다.
```javascript
export default class App extends Component {
```

앱의 상태를 기록할 state 객체이다. json타입이며, state의 값이 바뀌면 가상돔이 업데이트되고 변경점이 뷰에 갱신된다.
```javascript
  state = {
    key:"1234abc",
    //isReady:"false",
    NfcTagObj:null,
    bytes:null,
    //output:null,
  };
```

 객체 생성자이다. new App(인자1, ...) 이러한 방식으로 클래스 인스턴스가 생성.
 <br/>리액트에서의 의미는 \<App prop1={prop1}...\/> 이러한방식으로 엘레멘트 태그를 하나 사용하는 것과 같다. 

```javascript
  constructor(props){
    super(props);
    //초기화 메서드
    this._initNfc();
  }
```
<p>초기화 메서드들을 따로 클래스 메서드로 구현하여 사용한다.</p>

<p> 모듈사용을 초기화하기위한 메서드와, NFC 사용가능여부를 확인하는 메서드를 실행한다.<br/>
이후에 NFC태그 접촉 이벤트를 등록해준다.</p>

```javascript

  _initNfc = () => {
    //모듈 초기화 메서드
    NfcManager.start();

    //디바이스 NFC기능 On/Off 여부
    NfcManager.isEnabled();
    this.setState({isReady: "true"});
    
    //NFC Tag 접촉시 발생하는 이벤트를 지정하는 클래스 메서드
    this.registerTagEvent();
  }
```

asnyc () => {} :
비동기 함수로 구현한이유는, 태그접촉이 언제 일어날지 모르는 상황에서,
동기함수로 구현하면, js엔진이 다른작업을 하지않고 태그접촉 대기상태에 놓인다. 그러므로 비동기함수로 실행하여 이벤트 루프에서 실행시키도록 한다.<br/>
<p>
또한 화살표 함수를 사용하는 이유는, function(){}으로 구현시, 클래스의 this와 메서드의 this가 따로 구분되는데, function의 this는 사용하지않는다. 그러므로 bind를 해주어야 하는데, 화살표함수는 애초에 this를 갖고 있지 않기 떄문에 화살표 함수로 구현
</p>

```javascript
  registerTagEvent = async () =>{//비동기로 설정해야 언제가될지모르는 NFC태그를 실행가능.비동기가 아니면 initNfc에서 정지한다.
    //어플이 NFC 태그에 의해 실행되었다면, 해당 NFC 정보를 갖고 있는 NFC Tag Object 객체를 받아와서 state에 저장한다.
    this.setState({NfcTagObj:NfcManager.getLaunchTagEvent()})

    //태그 접촉시 전송할 NdefMessage를 미리 작성해 둔다.여기에 키값이 실린다.
    this.setState({bytes : Ndef.encodeMessage([Ndef.textRecord(this.state.key),Ndef.textRecord("1"), Ndef.textRecord("12")])});
    
    if(this.state.NfcTagObj == null){//만약 Nfc Tag에 의해 실행된 것이아니라면 , state는 null 이다.
      //Nfc 태그이벤트 발생시 메서드 지정.                    해당 메서드는 클래스 상에 지정함.
      NfcManager.setEventListener(NfcEvents.DiscoverTag, this._onTagDiscovered);
      }
  }
```
<p>
NFC 태그접촉 이벤트가 발생했을때, 해당 태그로 전송할 데이터인 Ndef포맷의 Message를 미리 만들어 둔다.setEventListener 메서드를 사용하여 이벤트 핸들러를 등록한다.
</p>

<p>
태그 접촉 이벤트 핸들러 이다. <br/>
태그 접촉시 태그정보를 state에 저장해둔다. 이후에 미리 작성해둔 NdefMessage를 requestNdefWrite로 전송대기 상태로 만든다. 전송이 완료된이후에 unregisterTargetEvent() 메서드로 이벤트 대기상태를 해제시킨다.
</p>

```javascript  
  _onTagDiscovered = async (tag) => {
    //태그를 발견시, 태그 obj를 state에 저장.
    this.setState({NfcTagObj : tag});
    
    // Ndef전송 메서드 실행.
    await NfcManager.requestNdefWrite(this.state.bytes); 
    //실제로 보내는건 못해 아직
    //여기까지가 encode해서 전송대기상태
    
    //보낸 이후엔 항상 unregister 해준다.
    NfcManager.unregisterTargetEvent();
    
  }
```

```javascript
  //_pressPrint = async () => {
    //여기서부턴 NFC를 통해 NfcTagObject객체를 받았다고 가정하여
    // Ndef 디코딩하는 과정
    // 실제 Ndef 디코딩은 아두이노 에서 진행하므로, 굳이 신경쓰지 않아도 된다.
    /*
    let parse = null;
    const ndefRecords = bytes;
    function decodeNdefRecord(record){
        console.log("record : ", record);
        console.log("hey",record.payload);
        if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)){    
        return ['text', Ndef.text.decodePayload(record.payload)];
      }else {
        return ['unknown', '---'];
      }
    }
    parse = ndefRecords.map(decodeNdefRecord);
    this.setState({output : parse});
    */
  // }
```

컴포넌트(해당 클래스 인스턴스)의 사용이 종료될 경우에, 다음을 실행하여 이벤트대기와 모듈사용을 종료한다.
```javascript
  componentWillUnmount(){
    //리스너 해제
    NfcManager.unregisterTargetEvent();
    NfcManager.stop();
  }
```

화면 구성을 위한 render() 메서드이다.
```javascript
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.upper}>
          <Text style={{backgroundColor:"white", color:"green", marginBottom:25, fontSize:40}}>NFC</Text>
        </View>
        <View style={styles.lower}>
          <Text>Key : {this.state.key}</Text>
        </View>
      </View>
    );
  }
}
```

화면의 효과를 위한 stysheet 이다.(css에 대응)
```javascript
const styles = StyleSheet.create({
  container:{
    flex : 1,
  },
  upper:{
    flex: 1,
    backgroundColor: "#004423",
    justifyContent:"center",
    alignItems:"center"
  },
  lower:{
    flex:1,
    backgroundColor:"#442300",
    color:"red"
  },
});
```
