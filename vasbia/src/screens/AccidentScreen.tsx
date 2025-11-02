import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BackIcon from "../assets/icons/BackIcon";

export default function AccidentScreen({ navigation }: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const accidentTypes = [
    "อุบัติเหตุเล็กน้อย",
    "อุบัติเหตุร้ายแรง",
    "รถเสีย",
    "การจราจรติดขัด",
  ];

  const handleSelect = (item: string) => {
    setSelectedCategory(item);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>VUSBIA</Text>
      <Text style={styles.subtitle}>รายงานอุบัติเหตุ</Text>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* ประเภทอุบัติเหตุ */}
        <Text style={styles.label}>ประเภทอุบัติเหตุ</Text>

        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setShowDropdown(!showDropdown)}
          activeOpacity={0.7}
        >
          <Text style={[styles.inputText, { color: selectedCategory ? "#000" : "#626262" }]}>
            {selectedCategory || "เลือกประเภทอุบัติเหตุ"}
          </Text>
        </TouchableOpacity>

        {/* Dropdown options */}
        {showDropdown && (
          <View style={styles.dropdownBox}>
            {accidentTypes.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* เวลาเกิดเหตุ */}
        <Text style={[styles.label, { marginTop: 36 }]}>เวลาเกิดเหตุ</Text>
        <View style={styles.inputField}>
          <TextInput
            style={styles.inputText}
            placeholder="เช่น 10:30 น."
            placeholderTextColor="#626262"
          />
        </View>

        {/* รายละเอียดเพิ่มเติม */}
        <Text style={[styles.label, { marginTop: 36 }]}>รายละเอียดเพิ่มเติม</Text>
        <View style={styles.inputField}>
          <TextInput
            style={styles.inputText}
            placeholder="กรอกรายละเอียดเพิ่มเติม..."
            placeholderTextColor="#626262"
          />
        </View>

        {/* สายรถ */}
        <Text style={[styles.label, { marginTop: 36 }]}>สายรถ</Text>
        <View style={styles.inputField}>
          <TextInput style={styles.inputText} placeholder="เช่น สาย 5" placeholderTextColor="#626262" />
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <BackIcon size={40} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 40,
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 24,
    color: "#626262",
    opacity: 0.6,
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    marginTop: 40,
    paddingBottom: 80,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 20,
    color: "#000",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#626262",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 60,
    justifyContent: "center",
    marginTop: 9,
  },
  inputText: {
    fontFamily: "Inter",
    fontSize: 20,
    color: "#626262",
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#626262",
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 18,
    color: "#000",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 16,
  },
});
