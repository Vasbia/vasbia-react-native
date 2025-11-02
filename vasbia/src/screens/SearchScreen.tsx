import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BackIcon from '../assets/icons/BackIcon';
import SearchBar from '../components/SearchBar';
import Config from 'react-native-config'; // Make sure you have your BASE_API_URL here

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState([
    'อาคาร 12 ชั้น',
    'โรงอาหาร A',
    'อาคาร CCA',
  ]);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  // 🧠 Fetch suggestions when user types
  React.useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Example API: change this to your actual endpoint
        const response = await fetch(`${Config.BASE_API_URL}/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        // Assume your API returns an array of matching results
        setSuggestions(data.slice(0, 3)); // only show 3
      } catch (error) {
        console.error("❌ Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400); // small debounce

    return () => clearTimeout(timer);
  }, [query]);

  // 🧩 When submitting a search (press enter)
  const handleSubmit = (text: string) => {
    setRecent(prev => {
      const updated = prev.filter(item => item !== text);
      return [text, ...updated];
    });
    setQuery('');
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('BusDriver')}>
        <BackIcon size={40} color="#000" />
      </TouchableOpacity>

      {/* 🔠 Title */}
      <Text style={styles.title}>VUSBIA</Text>

      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหา"
          onSubmit={handleSubmit}
        />
      </View>

      {/* 🧭 Suggestions Section */}
      {query.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>ผลลัพธ์ที่ใกล้เคียง</Text>
          {loading ? (
            <ActivityIndicator color="#2D6EFF" style={{ marginTop: 16 }} />
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item, i) => i.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() => handleSubmit(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#2D6EFF' }]} />
                  <Text style={styles.resultText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* 🕓 Recent Searches */}
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>ค้นหาล่าสุด</Text>
      <FlatList
        data={recent}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultRow}
            onPress={() => setQuery(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle} />
            <Text style={styles.resultText}>{item}</Text>
            <TouchableOpacity
              onPress={() => setRecent(prev => prev.filter(r => r !== item))}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.removeText}>x</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 40,
    lineHeight: 60,
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  searchBar: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '500',
    color: '#626262',
    opacity: 0.8,
  },
  listContainer: {
    marginTop: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(98,98,98,0.3)',
  },
  iconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B0B0B0',
    marginRight: 12,
  },
  resultText: {
    flex: 1,
    fontSize: 18,
    color: '#626262',
  },
  removeText: {
    fontSize: 18,
    color: '#626262',
    marginLeft: 8,
  },
});
