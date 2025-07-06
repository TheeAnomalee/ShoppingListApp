import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // ✅ Corrected import

export default function App() {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const clearAll = () => {
    setList([]);
  };

  const addItem = () => {
    if (item.trim() === '') return;
    setList(prevList => [
      ...prevList,
      {
        id: Date.now().toString(),
        name: item.trim(),
        date: new Date().toLocaleString(),
        completed: false,
        favorite: false,
      }
    ]);
    setItem('');
    Keyboard.dismiss();
  };

  const removeItem = (id) => {
    setList(prevList => prevList.filter(i => i.id !== id));
  };

  const toggleComplete = (id) => {
    setList(prevList =>
      prevList.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const toggleFavorite = (id) => {
    setList(prev =>
      prev.map(i =>
        i.id === id ? { ...i, favorite: !i.favorite } : i
      )
    );
  };

  const themeStyles = {
    backgroundColor: darkMode ? '#121212' : '#ffffff',
    textColor: darkMode ? '#ffffff' : '#000000',
    subTextColor: darkMode ? '#bbbbbb' : '#777777',
    inputBg: darkMode ? '#1e1e1e' : '#f9f9f9',
    borderColor: darkMode ? '#444' : '#ccc'
  };

  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.itemTextContainer}
        onPress={() => toggleComplete(item.id)}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.itemText,
              item.completed && styles.completed,
              { color: darkMode ? '#fff' : '#000' },
            ]}
          >
            {item.name} -
          </Text>
          <Text style={{ color: darkMode ? '#ccc' : '#666' }}>
            {item.date}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Icon
            name={item.favorite ? 'star' : 'star-border'}
            size={20}
            color={item.favorite ? 'gold' : '#999'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Icon name="delete" size={20} color="#900" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles.textColor }]}>🛒 Shopping List</Text>

      <View style={styles.toggleRow}>
        <Text style={{ color: themeStyles.textColor }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: themeStyles.borderColor,
            paddingHorizontal: 10,
            borderRadius: 6,
            backgroundColor: themeStyles.inputBg,
            color: themeStyles.textColor,
          }}
          placeholder="Add an item"
          placeholderTextColor={themeStyles.subTextColor}
          value={item}
          onChangeText={setItem}
          onSubmitEditing={addItem}
          returnKeyType="done"
          autoFocus={true}
        />
        <Button title="Add" onPress={addItem} />
      </View>

      {/* ⭐ Favorite List */}
      {list.some(i => i.favorite) && (
        <>
          <Text style={[styles.sectionHeader, { color: themeStyles.textColor }]}>
            ⭐ Favorites
          </Text>
          <FlatList
            data={list.filter(i => i.favorite)}
            keyExtractor={i => i.id}
            renderItem={renderListItem}
            ListEmptyComponent={null}
          />
        </>
      )}

      {/* 📋 Main List */}
      <FlatList
        data={list.filter(i => !i.favorite)}
        keyExtractor={item => item.id}
        renderItem={renderListItem}
        ListEmptyComponent={<Text style={styles.empty}>No items yet</Text>}
      />

      <View style={styles.clearAllContainer}>
        <Button title="Clear All" onPress={clearAll} color="#d9534f" />
      </View>

      <Text style={[styles.tip, { color: themeStyles.subTextColor }]}>
        Tip: Tap an item to mark complete. Tap 🗑 or ⭐ to remove/favorite.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    alignItems: 'center',
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
  },
  tip: {
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  clearAllContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});
