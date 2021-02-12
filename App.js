import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  // AsyncStorage,
  Button,
  TouchableOpacity
} from "react-native";
import { AppLoading } from "expo";
import ToDo from "./ToDo";
import FlipToggle from 'react-native-flip-toggle-button'
import uuidv1 from "uuid/v1";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage' ;


const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {},
    isSortDown: false
  };
  componentDidMount = () => {
    this._loadToDos();
  };
  render() {
    const { newToDo, loadedToDos, toDos, isSortDown } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>오늘할일</Text>
        
        <View style={styles.header}>
          <TextInput
              style={styles.input}
              placeholder={"새로입력"}
              value={newToDo}
              onChangeText={this._crontollNewToDo}
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              onSubmitEditing={this._addToDo}
              underlineColorAndroid={"transparent"}
            />
            <TouchableOpacity>
              <MaterialCommunityIcons 
                style={styles.addBtn} 
                size={30} 
                name='plus-circle' 
                onPress={this._addToDo}
              />
            </TouchableOpacity>
            {/* <Button 
              title="추가"
              onPress={this._addToDo}
            /> */}
        </View>

        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              // .reverse()
              .sort(function(a,b){
                if(!isSortDown){
                  return a.createdAt - b.createdAt;
                }
                else{
                  return a.isCompleted == false ? -1 : b.isCompleted == false ? 1 : 0;
                }
              })
              .map(toDo => (
                <ToDo
                  key={toDo.id}
                  deleteToDo={this._deleteToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  updateToDo={this._updateToDo}
                  {...toDo}
                />
              ))}
          </ScrollView>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>완료된 일정 내리기</Text>
          <FlipToggle
                value={isSortDown}
                buttonWidth={50}
                buttonHeight={25}
                buttonRadius={40}
                sliderWidth={20}
                sliderHeight={20}
                sliderRadius={50}
                onLabel={'On'}
                offLabel={'Off'}
                labelStyle={{ color: 'black' }}
                onToggle={
                  // (newState) => console.log(`toggle is ${this.state.isSortDown ? `on` : `off`}`)
                  this._toggleSortDown
                }
                onToggleLongPress={() => console.log('toggle long pressed!')}
            />
          <TouchableOpacity >
              {/* <Button title="적용" onPress={this._toggleSortDown}></Button> */}
          </TouchableOpacity>
        </View>
        <Text>Made by leaping96</Text>
      </View>
    );
  }
  _crontollNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({ loadedToDos: true, toDos: parsedToDos || {} });
      // console.log(toDos);
    } catch (err) {
      console.log(err);
    }
  };
  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
             ...prevState.toDos[id], 
             isCompleted: true 
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: { ...prevState.toDos[id], text: text }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _saveToDos = newToDos => {
  // console.log(JSON.stringify(newToDos));
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };

  // 여기
  _toggleSortDown = () => {
    const { isSortDown } = this.state;
    console.log(isSortDown);
    this.setState(prevState => {
      return {
        isSortDown: !prevState.isSortDown
      };
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#819FF7",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 15,
    fontWeight: "200",
    marginBottom: 15
  },
  header:{
    justifyContent: 'space-between',
    flexDirection: "row",
    backgroundColor: "white",
    width: width -25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 20,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  card: {
    backgroundColor: "white",
    flex: 0.9,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    // padding: 10,
    borderBottomColor: "#bbb",
    // borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    // width: width / 2,
    
    padding: 10,
    flex:0.1,
    backgroundColor: "gray",
    width: width - 25,
    marginTop: 10,
    
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  footerText:{
    fontSize: 30,
    color: Colors.white,
    marginRight: 20
  }
});
