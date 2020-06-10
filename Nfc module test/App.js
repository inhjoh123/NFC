import React, {Component} from "react";
import {View, Text, StyleSheet, StatusBar,TouchableOpacity} from "react-native";
import NfcManager, {Ndef, NfcEvents, ByteParser} from "react-native-nfc-manager";

export default class App extends Component {

  state = {
    key:"1234abc",
    //isReady:"false",
    NfcTagObj:null,
    bytes:null,
    //output:null,
  };

  constructor(props){
    super(props);
    //초기화 메서드
    this._initNfc();
  }

  _initNfc = () => {
    //모듈 초기화 메서드
    NfcManager.start();

    //디바이스 NFC기능 On/Off 여부
    NfcManager.isEnabled();
    this.setState({isReady: "true"});
    
    //NFC Tag 접촉시 발생하는 이벤트를 지정하는 클래스 메서드
    this.registerTagEvent();
  }

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

  //
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

  componentWillUnmount(){
    //리스너 해제
    NfcManager.unregisterTargetEvent();
    NfcManager.stop();
  }

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