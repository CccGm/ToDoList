import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#6a91e6', white: '#fff'};

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
      setShowInput(false);
    }
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const markTodoUnComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: false};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const ListItem = ({todo}) => {
    return (
      <View
        style={[
          styles.listItem,
          {borderColor: todo?.completed ? 'white' : '#6a91e6', borderWidth: 1},
        ]}>
        <View style={{flex: 1, flexDirection: 'row', gap: 10}}>
          {todo?.completed ? (
            <TouchableOpacity onPress={() => markTodoUnComplete(todo.id)}>
              <View style={[styles.actionIcon]}>
                <Icon name="radio-button-on" size={20} color="black" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
              <View style={[styles.actionIcon]}>
                <Icon name="radio-button-off" size={20} color="#6a91e6" />
              </View>
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontSize: 15,
              color: 'black',
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>

        {todo?.completed && (
          <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
            <View style={styles.actionIcon}>
              <Icon name="delete-outline" size={24} color={'#ff7f7f'} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {showInput ? (
        <>
          <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
            <Text style={{color: 'gray', fontSize: 20}}>Type your task</Text>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType="default"
                value={textInput}
                placeholder="task ..."
                onChangeText={text => setTextInput(text)}
                multiline
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'flex-end',
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowInput(false);
                  setTextInput('');
                }}>
                <View style={styles.iconContainer}>
                  <Text style={{color: 'white', fontSize: 18}}>Dismiss</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={addTodo}>
                <View style={styles.iconContainer}>
                  <Text style={{color: 'white', fontSize: 18}}>Add</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: COLORS.white,
              }}>
              To Do List
            </Text>
            <Icon
              name="add"
              size={28}
              color="#fff"
              onPress={() => {
                setShowInput(true);
              }}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: 20, paddingBottom: 100}}
            data={todos}
            renderItem={({item}) => <ListItem todo={item} />}
          />

          {/* <TouchableOpacity
            onPress={() => {
              setShowInput(true);
            }}
            style={{position: 'absolute', bottom: 20, right: 20}}>
            <View style={styles.iconContainer}>
              <Icon name="add" color="white" size={30} />
              <Text style={{color: 'white', fontSize: 18}}>Add</Text>
            </View>
          </TouchableOpacity> */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#00808090',
                flex: 1,
                padding: 15,
                alignItems: 'center',
              }}>
              <Text>Hello</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#798165',
                flex: 1,
                padding: 15,
                alignItems: 'center',
              }}>
              <Text>Secound</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 100,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 8,
    borderRadius: 15,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightblue',
  },
});

export default App;
