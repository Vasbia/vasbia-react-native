import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BackIcon from '../assets/icons/BackIcon';
import SearchBar from '../components/SearchBar';
import Config from 'react-native-config';

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState([
    'อาคาร 12 ชั้น',
    'โรงอาหาร A',
    'อาคาร CCA',
  ]);
  const [suggestions, setSuggestions] = React.useState<{name: string, id: number, lon: number, lat: number, type: string}[]>([]);
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
        const response = await fetch(`${Config.BASE_API_URL}/api/search/substring?keyword=${encodeURIComponent(query)}`);
        const data = await response.json();
        // Assume your API returns an array of matching results
        var matches = data.matches.slice(0, 3).map((item: any) => ({
          name: item.name,
          id: item.id,
          lon: item.longitude,
          lat: item.latitude,
          type: item.type,
        }));
        setSuggestions(matches); // only show 3
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
  const handleSubmit = (text: string, id?: number, latitude?: number, longitude?: number, type?: string) => {
    setRecent(prev => {
      const updated = prev.filter(item => item !== text);
      return [text, ...updated];
    });
    setQuery('');

    (navigation as any).navigate('Map', { search_location: { id, latitude, longitude, type } });
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Map')}>
        <BackIcon size={40} color="#000" />
      </TouchableOpacity>

      {/* 🔠 Title */}
      <Text style={styles.title}>VASBIA</Text>

      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          inputStyle={styles.inputStyle}
          placeholder="Search for bus stops/routes here"
          onSubmit={handleSubmit}
        />
      </View>

      {/* 🧭 Suggestions Section */}
      {query.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Similiar results</Text>
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
                  onPress={() => handleSubmit(item.name, item.id, item.lat, item.lon, item.type)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#2D6EFF' }]} />
                  <Text style={styles.resultText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* 🕓 Recent Searches */}
      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Recently searched</Text>
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

const {width: screenWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: screenWidth * 0.025,
    top: 64,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Inter_24pt-SemiBold',
    fontSize: 40,
    lineHeight: 60,
    textAlign: 'center',
    color: '#000',
    marginTop: 64,
  },
  searchBar: {
    padding: 8,
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-Regular',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-SemiBold',
    color: '#000',
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
    backgroundColor: '#2d6eff',
    marginRight: 12,
  },
  resultText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter_24pt-Regular',
    color: '#626262',
  },
  removeText: {
    fontSize: 18,
    color: '#626262',
    marginLeft: 8,
  },
});
