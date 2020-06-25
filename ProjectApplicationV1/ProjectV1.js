import React, {Component} from 'react';
import {
//ScrollView,
  View,
  Text,
  Image,
  TextInput,
//  StatusBar,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,           //사용자 정보를 저장하기 위해 필요한 모듈
  ToastAndroid,
} from 'react-native';
import Axios from 'axios';//HTTP 서버로부터 데이터를 요청하기 위해 필요한 모듈


export default class App extends Component{ 
  
  state = {
    //상태관련자들
    isLoading:true,//사용자 정보가 AsyncStorage에 있는지 없는지에 따라 타이틀화면이 결정되기 이전 로딩 화면출력
    isTitle:false, //로딩이 완료된 이후에 title화면으로 전환하기 위한 state
    isSent:null,
    isNfc:null,    //Nfc가 있다면 Key 정보조회, Nfc가 없으면 Key 발급기능 으로 결정
		titleNo:null,  //인증키가 있는지, 없는지, 실패했는지
    
    //Text Input 변수들
    name:"",       //TextInput에 입력하는 값을 저장.
    age:"",
    phone:"",
    email:"",
    company:"",

    //키발급 요청,실패
    error:null,      
    response:null,
    
    userInfo:{
      id:"",
      name:"",
      age:"",
      email:"",
      nfcKey:"",
      company:"",
    }, //발급성공시 응답으로 넘어온 데이터를 저장.
                   //이미 발급을 받은상태라면 앱 실행시 asyncStorage에서 로드
    nfcText:"",
	};

  constructor(){
    super();
  }
  
  componentDidMount(){//loading화면으로 render가 진행된 이후부터, 키발급유무에 따라 title화면을 결정
    this.loadDatafromAsyncStorage();//AsyncStorage를 조회해서 타이틀화면결정하기위한 지정메서드
  }

  loadDatafromAsyncStorage = async () => {

    const userInfo = await AsyncStorage.getItem("userInf"); //"userInf"라는 키값으로 사용자정보를 로드
    const isSent = await AsyncStorage.getItem("isSent");//null이면 보낸적없고, true면 보낸거고, false면 보내서 이미 처리된거.

    console.log("User Infomation",userInfo);
    
    if (userInfo == null){   //userInf가 없으면
      if(isSent == null){
        this.setState({
          titleNo:"title2",   //키발급을 위한 2번타이틀화면으로 실행
          isLoading:false,    //로딩화면은 종료
          isTitle:true,       //타이틀화면으로 전환
          isNfc:false,        //userInf가 없기때문에 isNfc는 false
        });
      }else if (isSent == "true"){
        this.setState({
          titleNo:"title4",   //키발급을 위한 2번타이틀화면으로 실행
          isLoading:false,    //로딩화면은 종료
          isTitle:true,       //타이틀화면으로 전환
          isNfc:false,        //userInf가 없기때문에 isNfc는 false
        });
      }
      return false;
    }else{
      this.setState({//userInf가 있으면
        userInfo:JSON.parse(userInfo),//
        titleNo:"title1",       //키확인을 위한 1번타이틀화면으로 실행
        isLoading:false,        //로딩화면은 종료
        isTitle:true,           //타이틀화면으로 전환
        isNfc:true,             //userInf가 있기때문에 inNfc는 true
      });
      return true;
    }
  }  
  _title = async () => {    //키확인 View에서 "확인"버튼을 눌러서 다시 타이틀로 전환하기 위한 메서드
  //await AsyncStorage.removeItem("userInf");  
  this.setState({   //키확인은 어차피 titleNo가 "title1"로 고정이기 때문에 isTitle만 변경하여 rerender 진행
      isTitle:true,
    });
	}


  _KeyReqServ = async () =>{//키 발급 화면에서 "발 급" 버튼을 눌러서 발급절차를 위한 메서드
    await Axios.post("http://192.168.1.50:5000/getSquare1",{ //post 방식으로 요청
      "number":5,//임시
      //name:this.state.name,
      //age:this.state.age,
      //phone:this.state.phone,
      //email:this.state.email,
      //company:this.state.company,
    })
    .then(response=>{
      this.setState({
        response:response["data"]["answer"],   
        isTitle:true,     
        isNfc:false,
        titleNo:"title4",
        //name:"",
        //age:"",
        //phone:"",
        //email:"",
        //company:"",
      });
      AsyncStorage.setItem("isSent","true");

    })
    .catch(error=>{           //에러시
      console.log("error :", error);  //출력
      this.setState({
        error:error,        //에러 저장. 3번 화면에 출력예정.
        titleNo:"title3",   //에러시 title View
        isTitle:true,       //타이틀로전환
        name:"",          //TextInput 입력값들 초기화
        age:"",
        phone:"",
        email:"",
        company:"",
      })
    })
	}
 
  isKeyReqAccept = async () => {
    await Axios.post("http://192.168.1.50:5000/getSquare2",{
      "number":6,
    })
    .then(response=>{
      if(response["data"]["answer"] == 36){
       //var userInf = response["answer"] 
       //이렇게 지정하지말고, 서버로 넘겨받은 response에서 추출해야한다.
       var userInf = {   
         id:"admin",
         name:"이경호",//현재는 내가 입력한걸 하고있는데, 실제론 어차피 서버에서 전달됨. 지금은 테스트를 위함이고,그래서 껐다켠상태에서 승인대기화면에서 이게 null이어도 상관없ㅇ므

         phone:"01054414445",
         email:"purplight2m@gmail.com",
         company:"Company 1",
         nfcKey:"00000000000000000000000000000000000000000000001234",
       }
      
        AsyncStorage.setItem("userInf",JSON.stringify(userInf));
        AsyncStorage.removeItem("isSent");
        this.setState({     
          response:response,
          isTitle:false,     
          isNfc:true,
          titleNo:"title1",
          userInfo:userInf,
          name:"",     
          age:"",
          phone:"",
          email:"",
          company:"",
          nfcText:"승인 되었습니다!!"
        });
      }
    })
    .catch(error=>{           //에러시
      console.log("error :", error);  //출력
      this.setState({
        titleNo:"title4",   //에러시 title View
        isTitle:true,       //타이틀로전환
        // name:"",          //TextInput 입력값들 초기화
        // age:"",
        // phone:"",
        // email:"",
        // company:"",
      });
      titleCases["title4"].title = ""
    });
  }

  render(){
    
    return(
    <View style={styles.container}>
      <View style={styles.header}>
			<Text style={styles.headerText}>NFC KEY</Text>
			<View style={styles.headerBtn}>
        <TouchableOpacity 
        style={{alignItems:"center"}}
        onPress={(this.state.isTitle && this.state.titleNo=="title1")? (async () => {
          this.setState({
            isNfc:false,
            isTitle:true,
            titleNo:"title2",
            // name:"",          //TextInput 입력값들 초기화
            // age:"",
            // phone:"",
            // email:"",
            // company:"",
          });  
          await AsyncStorage.removeItem("userInf");

        }):(null)}>
          <Image source={require("./image/trash.png")}/>
          <Text style={{color:"purple"}}>인증키 폐기</Text>
        </TouchableOpacity>
			</View>
		</View>                 
    {this.state.isLoading?(
    <View style={styles.body}>
      <View style={styles.upper}>
      </View>
      <View style={styles.lower}>
        <Text>is Loading</Text>
      </View>
    </View>
    ): (this.state.isTitle? (
      <View style={styles.body}>
        <View style={styles.upper}>
          {this.state.titleNo=="title4"?
          <TouchableOpacity 
            style={titleCases[this.state.titleNo].BtnStyle}
            onPress={()=>{this.isKeyReqAccept()}}>
            <Image source={titleCases[this.state.titleNo]["imageSrc"]}/>
          </TouchableOpacity>
          :
          <TouchableOpacity 
            style={titleCases[this.state.titleNo].BtnStyle}
            onPress={()=>{this.setState({isTitle:false, nfcText:"인증키를 보유중입니다."})}}>
            <Image source={titleCases[this.state.titleNo]["imageSrc"]}/>
          </TouchableOpacity>
          }
        </View>
        <View style={styles.lower}>
          <Text style={styles.titleText}>
            {titleCases[this.state.titleNo].title}
          </Text>
        </View>  
      </View>
        ):(this.state.isNfc?(
      <View style={styles.body}>
        <View style={styles.upper}>
          <View style={styles.left}>			
            <Text style={styles.infoText}>ID</Text>
            <Text style={styles.infoText}>이름</Text>
            <Text style={styles.infoText}>Phone</Text>
            <Text style={styles.infoText}>Email</Text>
            <Text style={styles.infoText}>소속</Text>
            <Text style={styles.infoText}>인증키</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.infoText}>{this.state.userInfo["id"]}</Text>
            <Text style={styles.infoText}>{this.state.userInfo["name"]}</Text>
            <Text style={styles.infoText}>{this.state.userInfo["phone"]}</Text>
            <Text style={styles.infoText}>{this.state.userInfo["email"]}</Text>
            <Text style={styles.infoText}>{this.state.userInfo["company"]}</Text>
            <Text style={styles.infoText}>{this.state.nfcText}</Text>
          </View>
        </View>
        <View style={styles.lower}>
          <TouchableOpacity onPress={this._title} style={styles.confirmBtn} >
            <Text style={{color:"magenta"}}>
              {"확 인"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        ):(
      <View style={styles.body}>
        <View style={styles.upper}>
          <View style={styles.left}>			
            <Text style={styles.infoText}>이름</Text>
            <Text style={styles.infoText}>나이</Text>
            <Text style={styles.infoText}>Phone</Text>
            <Text style={styles.infoText}>Email</Text>
            <Text style={styles.infoText}>소속</Text>
          </View>
          <View style={styles.right}>
            <TextInput style={styles.inputText} onChangeText={text=>{this.setState({name:text});}}
            placeholder="ex) 홍길동"
            value={this.state.name}/>
            <TextInput style={styles.inputText} onChangeText={text=>{this.setState({age:text});}}
            placeholder="ex) 15"
            value={this.state.age}/>
            <TextInput style={styles.inputText} onChangeText={text=>{this.setState({phone:text});}}
            placeholder="ex) 01012345678"
            value={this.state.phone}/>
            <TextInput style={styles.inputText} onChangeText={text=>{this.setState({email:text});}} 
            placeholder="ex) email@example.com"
            value={this.state.email}/>
            <TextInput style={styles.inputText} onChangeText={text=>{this.setState({company:text});}} 
            placeholder="ex) 3"
            value={this.state.company}/>
          </View>
        </View>
        <View style={styles.lower}>
          <TouchableOpacity onPress={this._KeyReqServ} style={styles.confirmBtn} >
            <Text style={{color:"magenta"}}>
              {"발급요청"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      )))}
   
    </View>
    );
  }
}
/*TextInput 키보드 화면에 나타났을때, 레이아웃 찌그러지는 문제
-> 이렇게 manifest 수정
<activity android:name="com.reactnativenavigation.controllers.NavigationActivity"
         android:windowSoftInputMode="stateAlwaysHidden|adjustPan|adjustResize" />
*/


const styles = StyleSheet.create({
	container:{
		backgroundColor:"#FF80FF",
    flexDirection:"column",
    flex:1,
    padding: 11,
	},
	header:{
    flex:1,
    flexDirection:"row",
		alignContent:"center",
	},
	headerText:{
    flex:2,
    color:"white",
    fontSize:30,
    fontWeight:"bold",
    fontFamily:"times",
    justifyContent:"center",
  },
  headerBtn:{
    flex:2,
    color:"#999922",
    padding:10,
    alignItems:"flex-end",
    justifyContent:"center",
  },
	body:{
    flex:10,
    flexDirection:"column",
    backgroundColor:"white",
    borderRadius:10,
	},
	upper:{
		flex:4,
    flexDirection:"row",
    justifyContent:"center",//수직정렬
    alignItems:"center",
  },
	lower:{
    flex:1,
    alignItems:"center",
  },
  titleText:{
    fontSize:23,
  },
	left:{
    flex:1,
    justifyContent:"center",//수직정렬
    alignItems:"center",
	},
	right:{
    flex:2,
    justifyContent:"center",//수직정렬
    alignItems:"center",
  },
  infoText:{
    margin : 12,
    fontSize : 20,
    fontWeight: "bold",
    color:"purple",
  },
  inputText:{
    backgroundColor:"#f7f7f7",
    width:"80%",
    marginTop:5,
    marginBottom:5,
    paddingTop:5,
    paddingBottom:5,
  },
	titleBtn1:{
    flex:1,
    marginStart:"30%",
    marginEnd:"30%",
    height : "40%",
    justifyContent:"center",//수직정렬
    alignItems:"center",
    //backgroundColor : "blue",

	},
	titleBtn2:{
    flex:1,
    width:"40%",
    height : "40%",
    justifyContent:"center",//수직정렬
    alignItems:"center",
    //backgroundColor : "gray",
	},
	titleBtn3:{
    flex:1,
    width:"40%",
    height : "40%",
    justifyContent:"center",//수직정렬
    alignItems:"center",
    //backgroundColor : "red",
  },
  titleBtn4:{
    flex:1,
    width:"40%",
    height : "40%",
    justifyContent:"center",//수직정렬
    alignItems:"center",
    //backgroundColor : "red",
  },
  confirmBtn:{
    backgroundColor:"#ffccaa",
    padding:30,
    borderRadius:20,
    borderColor:"#FFbfFF",
    borderWidth:3,
    borderStyle:"solid",
  }
});

const titleCases = {
	title1:{
  	BtnStyle : styles.titleBtn1,
    title:"인증키를 보유중입니다",
    imageSrc:require("./image/Nfc.png"),
	},
	title2:{
    BtnStyle : styles.titleBtn2,
    title:"인증키를 발급해 주세요.",
    imageSrc:require("./image/noNfc.png"),
	},
	title3:{	
    BtnStyle : styles.titleBtn3,
    title:"인증키 발급에 실패했습니다.",
    imageSrc:require("./image/failNfc.png"),
  },
  title4:{	
    BtnStyle : styles.titleBtn4,
    title:"승인 대기중입니다.",
    imageSrc:require("./image/waitNfc.png"),
  },
};