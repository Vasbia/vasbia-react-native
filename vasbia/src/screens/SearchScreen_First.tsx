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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BackIcon from '../assets/icons/BackIcon';
import SearchBar from '../components/SearchBar';

export default function SearchScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [query, setQuery] = React.useState('');
    const [recent, setRecent] = React.useState([
        'อาคาร 12 ชั้น',
        'โรงอาหาร A',
        'อาคาร CCA',
    ]);

    const filtered = recent.filter(r =>
        r.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <View style={styles.container}>
          {/* 🆕 Back button */}
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Map')}
        >
            <BackIcon size={40} color="#000" />
        </TouchableOpacity>

        {/* Top Title */}
        <Text style={styles.title}>VUSBIA</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="ค้นหา"
                onSubmit={(text) => {
                    setRecent(prev => {
                    const updated = prev.filter(item => item !== text);
                    return [text, ...updated];  // ✅ add new search at top
                    });
                setQuery(''); // optional clear input
            }}
            />
        </View>

        {/* Label */}
        <Text style={styles.sectionTitle}>ค้นหาล่าสุด</Text>

        {/* Recent Results */}
        <FlatList
            data={recent} // ✅ Use the full recent list, not filtered
            keyExtractor={(item, i) => i.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.resultRow}
                onPress={() => setQuery(item)} // ✅ Fills the search bar
                activeOpacity={0.7}
                >
                <View style={styles.iconCircle} />
                <Text style={styles.resultText}>{item}</Text>
                {/* keep "x" optional, but remove filtering logic */}
                <TouchableOpacity
                    onPress={() =>
                    setRecent(prev => prev.filter(r => r !== item))
                    }
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
  // 🆕 Back button styling
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
    marginTop: 30,
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
    backgroundColor: '#2D6EFF',
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
